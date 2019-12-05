
function Shader(gl, type, version) {

	const id = gl.createShader(type);

	return Object.create(
		{
			compile: function() {

				gl.compileShader(id);

				if(!gl.getShaderParameter(id, gl.COMPILE_STATUS))
				    throw `${type} ${gl.getShaderInfoLog(id)}`;
				
			},

			delete: function() {
				gl.deleteShader(id);
			}
		},
		{
			source: {
				set: function(value) {

					const format = `${Number(version) * 100}`.slice(0, 3);

					value = `#version ${format}\n ${value}`;

					gl.shaderSource(id, value);
				}
			},

			id: {
				get: function() {
					return id;
				}
			}
		}
	);
}

export { Shader };