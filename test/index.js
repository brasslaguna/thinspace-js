
import * as TS from "../index.js"
import { glMatrix, mat4, quat } from "gl-matrix"

/*

	Initializing WebGL context 

*/

const width = 1024;
const height = 1024;

const [ canvas ] = document.getElementsByTagName("canvas");
const context = TS.Context(canvas, ["webgl"]);

const {gl} = context;

canvas.width = width;
canvas.height = height;

gl.viewport(0, 0, width, height);


/*

	Enabling WebGL capabilities

		- Enable depth texture

*/

gl.enable(gl.DEPTH_TEST);
gl.getExtension("WEBGL_depth_texture");

/*
	
	Animation time

*/

let sineTime = 0;

/*

	Initializing camera

*/

const camera = 

	TS.Camera({

		fov: glMatrix.toRadian(45), 
		aspect: width/height,
		near: 0.1,
		far: 1000

	});

camera.transformation.translation = [0, 0, -6];


/*

	Initializing shader programs

*/

const shaderProgram = TS.Program({ 

	context,

	vertex: `

		precision highp float;

		attribute vec3 position;
		attribute vec2 texture;

		uniform mat4 model;
		uniform mat4 view;
		uniform mat4 projection;

		varying vec2 vertex_texture;

		void main() {

			gl_Position = projection * view * model * vec4(position, 1.0);

			vertex_texture = texture;
		
		}

	`,

	fragment: `

		precision highp float;

		varying vec2 vertex_texture;

		void main() {

			gl_FragColor = vec4(

				abs((vertex_texture.x - 0.5) * 2.0), 
				abs((vertex_texture.y - 0.5) * 2.0), 
				1.0, 
				1.0

			);

		}

	`

});

/*

	Create shape

*/

const sphere = 

	TS.Sphere({

		context, 
		resX: 50, 
		resY: 50 

	});


/*

	Creating a config for both color and depth textures

*/

const colorTextureConfig = 

	TS.FramebufferTextureConfig({

		gl,
		format: gl.RGB,
		internalFormat: gl.RGB,
		type: gl.UNSIGNED_BYTE

	});


/*

	Initializing PassPipelines 

*/

const passPipeline = TS.PassPipeline(context, width, height);


/*

	Attaching color texture to the framebuffer

*/

passPipeline.add(

	gl.COLOR_ATTACHMENT0,

	colorTextureConfig,

	() => {

		shaderProgram.use();

		/*

			Set all the uniforms to be used in the program.
		
		*/

		const view = camera.lookAt([0, 0, 0]);
		const projection = camera.perspective();

		shaderProgram.setUniforms({

			projection,
			view

		});

		sphere.draw({

			all: {

				attributeLocations: shaderProgram.attributes,

				callback: ({ matrix }) => shaderProgram.setUniform("model", matrix)

			}

		});

	}

);


/*
	
	Initializing PostProcessor

*/

const postProcessor = TS.PostProcessor(context, width, height);

/*

	Initializing PostProcessor shader program

*/

const postProcessorProgram = TS.Program({ 

	context,

	vertex: `

		precision highp float;

		attribute vec3 position;
		attribute vec2 texture;

		varying vec2 vertex_texture;

		void main() {

			gl_Position = vec4(position, 1.0);

			vertex_texture = texture;
		
		}

	`,

	fragment: `

		precision highp float;

		const float PI = ${Math.PI};

		uniform sampler2D texture0;
		uniform float time;

		varying vec2 vertex_texture;

		void main() {

			vec2 uv = vertex_texture;

			uv.y += (sin( time * (PI * 2.0) ) * 0.05) * sin(uv.x * (PI * 20.0));

			gl_FragColor = texture2D(texture0, uv);

		}

	`

});

/*

	Adding passes to PostProcessor

*/

postProcessor.passes([

	{
		textures: [

			passPipeline.framebuffer.attachment(gl.COLOR_ATTACHMENT0)

		],

		program: postProcessorProgram,

		callback: () => {

			postProcessorProgram.setUniform("time", sineTime);

		}

	}

]);


/*

	Initializing the view

*/

const view = TS.View(context);

view.addScreen({

	texture: postProcessor.framebuffer.attachment(gl.COLOR_ATTACHMENT0),

	matrix: mat4.create()

});


/*
	
	Initializing the timer

*/

const timer = TS.Timer(60);

timer.run(

	(elapsed, times) => {

		sineTime = ((times % 200) - 100) / 100;

		sphere.transformation.rotation[0] += 0.9;
		sphere.transformation.rotation[1] += 0.9;

		passPipeline.run([0, 0.5, 1.0, 1.0]);

		postProcessor.run();

		view.render();

	}

);