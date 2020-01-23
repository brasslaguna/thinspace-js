
function Framebuffer(gl) {

	const id = gl.createFramebuffer(),
		  attachments = {};

	return Object.create(
		{	
			bind: function() {
				gl.bindFramebuffer(gl.FRAMEBUFFER, id);
			},

			delete: function() {
				gl.deleteFramebuffer(id);
			},

			attach: function(target, attachment, buffer) {

				this.bind();

				switch(target) {

					case gl.TEXTURE_2D:

						gl.framebufferTexture2D(
							gl.FRAMEBUFFER,
							attachment,
							gl.TEXTURE_2D,
							buffer.id,
							0
						);

						break;

					case gl.RENDERBUFFER:

						gl.framebufferRenderbuffer(
							gl.FRAMEBUFFER,
							attachment,
							gl.RENDERBUFFER,
							buffer.id
						);
				}
				
				attachments[attachment] = buffer;

				return true;

			},

			attachment: function(name) {
				return attachments[name];
			}
		}
	);

}

module.exports = { Framebuffer };