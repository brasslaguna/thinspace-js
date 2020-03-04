
function View(context) {

	const { gl, Buffer, Shader, Program, glslVersion } = context;

	const createBuffer = () => {

		const buffer = Buffer(gl.ARRAY_BUFFER);

		const data = new Float32Array([
			-1, -1, 0, 0, 0,
			-1, 1, 0, 0, 1,
			1, -1, 0, 1, 0,
			1, 1, 0, 1, 1
		]);

		buffer.data({
			usage: gl.STATIC_DRAW,
			size: 4,
			offset: 0,
			data: data
		});

		buffer.addAttribute(
			"position",
			{
				size: 3,
				type: gl.FLOAT,
				normalized: false,
				stride: Float32Array.BYTES_PER_ELEMENT * 5,
				offset: 0
			}
		);

		buffer.addAttribute(
			"texture",
			{
				size: 2,
				type: gl.FLOAT,
				normalized: false,
				stride: Float32Array.BYTES_PER_ELEMENT * 5,
				offset: Float32Array.BYTES_PER_ELEMENT * 3
			}
		);

		return buffer;

	};

	const clear = () => {

		gl.clearColor(0, 0, 1, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	};

	const screens = [],
		  program = Program(),
		  buffer = createBuffer();

	const vertex = Shader(gl.VERTEX_SHADER, glslVersion),
		  fragment = Shader(gl.FRAGMENT_SHADER, glslVersion);

	vertex.source = 
		`
			precision highp float;

			in vec3 position;
			in vec2 texture;

			uniform mat4 model;

			out vec2 texture_;

			void main() {

				gl_Position = model * vec4(position, 1.0);
				texture_ = texture;

			}
		`;

	fragment.source =
		`
			precision highp float;

			in vec2 texture_;

			out vec4 color;

			uniform sampler2D texture0;

			void main() {

				color = texture(texture0, texture_);

			} 
		`;

	vertex.compile();
	fragment.compile();

	program.attach(vertex);
	program.attach(fragment);

	program.link();


	return Object.create(
		{
			addScreen: function({texture, matrix}) {
				
				screens.push({
					texture,
					matrix
				});

			},

			render: function() {

				gl.bindFramebuffer(gl.FRAMEBUFFER, null);

				clear();

				program.use();

				screens.forEach(value => {

					const {texture, matrix} = value;

					program.setUniform("model", matrix);

					texture.bind();
					program.setUniform("texture0", 0);

					buffer.setVertexAttribPointer(
						program.attributes
					);
					
					buffer.draw({ mode: gl.TRIANGLE_STRIP });

				});

			}
		}
	);
}

module.exports = { View };