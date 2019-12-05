
import { PassPipeline } from "./passPipeline"

function PostProcessor(context, width, height) {

	const {gl, Buffer} = context;

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

	const bufferConfig = () => {

		return {
			target: gl.TEXTURE_2D,
			format: gl.RGBA,
			internalFormat: gl.RGBA,
			type: gl.UNSIGNED_BYTE,
			width: width,
			height: height,
			data: null,

			parametersi: [
				{
					name: gl.TEXTURE_MIN_FILTER,
					value: gl.NEAREST,
				},
				{
					name: gl.TEXTURE_MAG_FILTER,
					value: gl.NEAREST,
				},
				{
					name: gl.TEXTURE_WRAP_S,
					value: gl.CLAMP_TO_EDGE,
				},
				{
					name: gl.TEXTURE_WRAP_T,
					value: gl.CLAMP_TO_EDGE,
				}
			]
		};

	};

	const pipeline = PassPipeline(context, width, height),
		  screen = createBuffer();

	let passes = [];

	return Object.create(
		{
			passes: function(value) {

				passes = value;

				passes.forEach(
					({textures = [], program, callback}, index) => {

						pipeline.add(
							gl.COLOR_ATTACHMENT0,
							bufferConfig(),
							() => {

								program.use();

								let textures_ = [];

								if(index) {
									textures_.push(
										pipeline.framebuffer.attachment(gl.COLOR_ATTACHMENT0)
									);
								}

								textures_ = textures_.concat(textures);

								textures_.forEach((value, index) => {

									value.bind(index);
									program.setUniform("texture" + index, index);

								});

								if(callback)
									callback(program);

								screen.setVertexAttribPointer(
									program.attributes
								);

								screen.draw({ mode: gl.TRIANGLE_STRIP });

							}
						);

					}
				);
			},

			run: () => {

				pipeline.run([0, 0, 0, 0]);

			}
		},
		{
			framebuffer: {
				get: function() {
					return pipeline.framebuffer;
				}
			}
		}
	);
}

export { PostProcessor };
