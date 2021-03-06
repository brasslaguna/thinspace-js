
const { Buffer } = require("../gl/buffer");
const { Framebuffer } = require("../gl/framebuffer");
const { Renderbuffer } = require("../gl/renderbuffer");
const { Texture } = require("../gl/texture");
const { Program } = require("../gl/program");
const { Shader } = require("../gl/shader");

const Context = (canvas, types = [], attributes = {}) => {

	const Resource = (name, constructor, ...params) => {

		const resource = constructor(context, ...params, extentions.method);

		resources[name].push(resource);

		return resource;

	};

	const get = (canvas, types, attributes) => {

		let context = null;

		types.forEach(value => {

			if(context)
				return;

			context = canvas.getContext(value, attributes);

		});

		return context;

	};

	const context = get(canvas, types, attributes);

	const extentions = Extensions(context);

	const resources = {

		buffer: [],
		framebuffer: [],
		renderbuffer: [],
		texture: [],
		program: [],
		shader: []

	};

	if(!context)
		return context;

	const info = {

		version: context.getParameter(context.VERSION),
		shadingLanguageVersion: context.getParameter(context.SHADING_LANGUAGE_VERSION),
		vendor: context.getParameter(context.VENDOR),

		abridged: {

			version: () => {
				return info.version.match(/webgl\s(\d[.]\d|\d)/i)[1];
			},

			shadingLanguageVersion: () => {

				switch(types[0]) {

					case "webgl": return "100";

					case "webgl2": return "300 es";

				}

				//return info.shadingLanguageVersion.match(/webgl\sglsl\ses\s(\d[.]\d+|\d+)/i)[1];
			
			}

		}

	};

	return Object.create(
		{

			Buffer: (...params) => {

				return Resource("buffer", Buffer, ...params);

			},

			Framebuffer: (...params) => {

				return Resource("framebuffer", Framebuffer, ...params);

			},

			Renderbuffer: (...params) => {

				return Resource("renderbuffer", Renderbuffer, ...params);

			},

			Texture: (...params) => {

				return Resource("texture", Texture, ...params);

			},

			Program: (...params) => {

				return Resource("program", Program, ...params);

			},

			Shader: (...params) => {

				return Resource("shader", Shader, ...params, info.abridged.shadingLanguageVersion());

			},

			delete: () => {

				for(const key in resources)

					resources[key].forEach(value => {

						value.delete();

					});

				try {

					context.getExtension("WEBGL_lose_context").loseContext();

				} catch(e) {

					console.error(e)

				}

			}
		},
		{
			gl: {
				get: () => {
					return context;
				}
			},

			version: {
				get: info.abridged.version
			},

			glslVersion: {
				get: info.abridged.shadingLanguageVersion
			},

			vendor: {
				get: () => {

					return info.vendor;

				} 
			},

			canvas: {

				get: () => {

					return canvas;

				}

			}
		}
	);

};

const Extensions = (context) => {

	const registered = {};

	const reference = {
		drawArraysInstancedANGLE: "ANGLE_instanced_arrays",
		drawElementsInstancedANGLE: "ANGLE_instanced_arrays",
		vertexAttribDivisorANGLE: "ANGLE_instanced_arrays"
	};

	return Object.create(
		{
			method: (name, ...params) => {

				const extName = reference[name],
					  ext = registered[extName];

				if(!ext)

					registered[extName] = context.getExtension(extName);

				if(registered[extName])

					registered[extName][name].apply(registered[extName], params);

			}
		}
	);
};

module.exports = { Context };