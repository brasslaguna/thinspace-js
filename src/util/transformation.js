
const { glMatrix, vec3, mat4, quat } = require("gl-matrix");

function Transformation() {

	const rotate = () => {

		return quat.fromEuler(quat.create(), rotation[0], rotation[1], rotation[2]);

	};

	let translation = vec3.create(),
		scale = vec3.fromValues(1, 1, 1),
		rotation = vec3.create();

	return Object.create(
		null,
		{
			matrix: {
				get: function() {

					let matrix = mat4.create();

					mat4.fromRotationTranslationScale(
						matrix, 
						rotate(), 
						translation, 
						scale
					);

					return matrix;

				}
			},

			translation: {
				set: function(value) {
					translation = vec3.fromValues(...value);
				},
				get: function() {
					return translation;
				}
			},

			scale: {
				set: function(value) {
					scale = vec3.fromValues(...value);
				},
				get: function() {
					return scale;
				}
			},

			rotation: {
				set: function(value) {
					rotation = vec3.fromValues(...value);
				},
				get: function() {
					return rotation;
				}
			}
		}
	);

}

module.exports = { Transformation };