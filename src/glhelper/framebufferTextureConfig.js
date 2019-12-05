
function FramebufferTextureConfig({ gl, format, internalFormat, type }) {

	return {

		target: gl.TEXTURE_2D,
		format,
		internalFormat,
		type,
		data: null,

		parametersi: [
			{
				name: gl.TEXTURE_MIN_FILTER,
				value: gl.NEAREST
			},
			{
				name: gl.TEXTURE_MAG_FILTER,
				value: gl.NEAREST
			},
			{
				name: gl.TEXTURE_WRAP_S,
				value: gl.CLAMP_TO_EDGE
			},
			{
				name: gl.TEXTURE_WRAP_T,
				value: gl.CLAMP_TO_EDGE
			}
		]

	}

};

export { FramebufferTextureConfig };