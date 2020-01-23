
function Program({ context, vertex, fragment }) {

	const {
		gl, 
		Shader, 
		Program

	} = context;

	const vertexShader = Shader(gl.VERTEX_SHADER);
	const fragmentShader = Shader(gl.FRAGMENT_SHADER);
	const program = Program();

	vertexShader.source = vertex;
	fragmentShader.source = fragment;

	vertexShader.compile();
	fragmentShader.compile();

	program.attach(vertexShader);
	program.attach(fragmentShader);

	program.link();

	return Object.assign(

		program,

		{
			setUniforms: (uniforms = {}) => {

				Object.keys(uniforms)

					.forEach(key => {

						const value = uniforms[key];

						program.setUniform(key, value);

					});

			}
		}

	);

	return program;

};

module.exports = { Program };
