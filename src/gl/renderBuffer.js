
function Renderbuffer(gl, { internalFormat, width, height }) {

	const bind = () => {
		gl.bindRenderbuffer(gl.RENDERBUFFER, id);
	};

	const id = gl.createRenderbuffer();

	bind();

	gl.renderbufferStorage(
		gl.RENDERBUFFER,
		internalFormat,
		width,
		height
	);

	return Object.create(
		{
			bind,

			delete: function() {
				gl.deleteRenderbuffer(id);
			}
		},
		{
			id: {
				get: function() {
					return id;
				}
			}
		}
	);

}

export { Renderbuffer };