
function Texture(gl, target) {

	const id = gl.createTexture();

	return Object.create(
		{
			bind: function(unit = 0) {
				gl.activeTexture(gl.TEXTURE0 + unit);
				gl.bindTexture(target, id);
			},

			createImage: function(args) {

				this.bind();

				if(["IMG","VIDEO"].indexOf((args.data || {}).nodeName) > -1) {

					gl.texImage2D(
						args.target || target, 
						args.level || 0, 
						args.internalFormat,
						args.format,
						args.type,
						args.data
					);

				} else {

					gl.texImage2D(
						args.target || target, 
						args.level || 0, 
						args.internalFormat,
						args.width, 
						args.height, 
						args.border || 0, 
						args.format, 
						args.type, 
						args.data
					);

				}

				const {parametersi, parametersf} = args;

				if(parametersi)
					parametersi.forEach(({name, value}) => {
						gl.texParameteri(target, name, value);
					});

				if(parametersf)
					parametersf.forEach(({name, value}) => {
						gl.texParameterf(target, name, value);
					});
			},

			delete: function() {
				gl.deleteTexture(id);
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

module.exports = { Texture };