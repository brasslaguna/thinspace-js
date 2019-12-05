
function PassPipeline(context, width, height) {

	const {gl, Framebuffer, Renderbuffer, Texture} = context;

	const createBuffer = (target, config) => {

		let buffer = null;

		switch(target) {

			case gl.TEXTURE_2D:

				buffer = context.Texture(target);
				buffer.createImage(config);

				break;

			case gl.RENDERBUFFER:

				buffer = context.Renderbuffer(target);
		}

		return buffer;

	};

	const clear = (color = [0, 0, 0, 1]) => {
	 	gl.clearColor(...color);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	};

	const framebuffer = Framebuffer(),
		  passes = [];

	let depthBuffer = Renderbuffer({

		internalFormat: gl.DEPTH_COMPONENT16,
		width,
		height

	});

	framebuffer.attach(
		gl.RENDERBUFFER,
		gl.DEPTH_ATTACHMENT,
		depthBuffer
	);

	return Object.create(
		{
			add: function(attachment, bufferConfig, drawCallback) {

				const {target} = bufferConfig;

				bufferConfig.width = width;
				bufferConfig.height = height;

				if(
					!framebuffer.attach(
						target, 
						attachment, 
						createBuffer(target, bufferConfig)
					)
				) return;

				passes.push({
					attachment,
					drawCallback
				});

			},

			run: function(clearColor) {

				framebuffer.bind();

				passes.forEach(value => {

					let {attachment, drawCallback} = value;

					if(!drawCallback) return;

					gl.viewport(0, 0, width, height);

					if(attachment == gl.DEPTH_ATTACHMENT)
						attachment = gl.NONE;

					if(gl.drawBuffers)
						gl.drawBuffers([].concat(attachment));

					clear(clearColor);

					drawCallback({
						framebuffer
					});

				});

			},

			resize: function(newWidth = width, newHeight = height) {

				width = newWidth;
				height = newHeight;

				depthBuffer.delete();

				depthBuffer = Renderbuffer({
					internalFormat: gl.DEPTH_COMPONENT16,
					width,
					height
				});

				framebuffer.attach(
					gl.RENDERBUFFER,
					gl.DEPTH_ATTACHMENT,
					depthBuffer
				);

			}

		}, 
		{
			framebuffer: {
				get: function() {
					return framebuffer;
				}
			}
		}
	);
}

export { PassPipeline };