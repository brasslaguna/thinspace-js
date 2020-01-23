
const Program = (gl) => {

	const uniformMap = [

		{ type: gl.FLOAT_VEC3, access: "uniform3fv" },
		{ type: gl.FLOAT_VEC2, access: "uniform2fv" },
		{ type: gl.FLOAT_MAT4, access: "uniformMatrix4fv" },
		{ type: gl.SAMPLER_2D, access: "uniform1i" },
		{ type: gl.INT, access: "uniform1i" },
		{ type: gl.FLOAT, access: "uniform1f" },
		{ type: gl.BOOL, access: "uniform1i" }

	];

	const setUniform = (uniform, index) => {

		uniformMap.forEach(value => {

			let name = uniform.name.replace(/\[\d+\]$/g, "");

			if(!name) return;

			name = (typeof index == "number") ? `${name}[${index}]` : name;

			if(value.type == uniform.type)

				uniforms[name] = {
					location: gl.getUniformLocation(id, name),
					access: value.access
				};

		});

	};

	const getUniforms = () => {

		const total = gl.getProgramParameter(id, gl.ACTIVE_UNIFORMS);

		for(let i = 0; i < total; i++) {

			let uniform = gl.getActiveUniform(id, i);

			if(uniform.size > 1) {

				for(let j = 0; j < uniform.size; j++)

					setUniform(uniform, j);

			} else {

				setUniform(uniform);

			}

		}
	};

	const getAttributes = () => {

		const total = gl.getProgramParameter(id, gl.ACTIVE_ATTRIBUTES);

		for(let i = 0; i < total; i++) {

			let {name} = gl.getActiveAttrib(id, i);

			attributes[name] = gl.getAttribLocation(id, name);

		}

	};

	const id = gl.createProgram(),
		  uniforms = {},
		  attributes = {};

	return Object.create(
		{
			attach: function(shader) {
				gl.attachShader(id, shader.id);
			},

			link: function() {
				gl.linkProgram(id);
				getAttributes();
				getUniforms();

				if(!gl.getProgramParameter(id, gl.LINK_STATUS))
				    throw `${gl.getProgramInfoLog(id)}`;

			},

			use: function() {
				gl.useProgram(id);
			},

			delete: function() {
				gl.deleteProgram(id);
			},

			setUniform: function(name, value) {

				const {access, location} = uniforms[name] || {};
				let params = [];

				if(!access) return;

				if(access.indexOf("Matrix") > -1) {
					params = [location, false, value];

				} else {
					params = [location, value];
					
				}

				gl[access](...params);

			}
		},
		{
			attributes: {
				get: () => {
					return attributes;
				}
			}
		}
	);
}

module.exports = { Program };