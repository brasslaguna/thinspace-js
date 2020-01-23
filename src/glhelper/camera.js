
const { Transformation } = require("../util/transformation")
const { mat4 } = require("gl-matrix");

function Camera({fov, aspect, near, far}) {

	const transformation = Transformation();

	return Object.create(
		{
			transformation: transformation,

			perspective: function() {

				const matrix = mat4.create();

				mat4.perspective(
					matrix,
					fov,
					aspect,
					near,
					far
				);

				return matrix;
			},

			view: function() {

				const matrix = mat4.create();

				 mat4.invert(matrix, transformation.matrix);

				return matrix;

			},

			lookAt: (center) => {

				const matrix = mat4.create();

				mat4.lookAt(
					matrix,
					transformation.translation,
					center,
					[0, 1, 0]
				);

				return matrix;

			}

		},
		{

			fov: {
				set: (value) => {
					fov = value;
				},
				get: () => {
					return fov;
				}
			},

			aspect: {
				set: (value) => {
					aspect = value;
				},
				get: () => {
					return aspect;
				}
			},

			near: {
				set: (value) => {
					near = value;
				},
				get: () => {
					return near;
				}
			},

			far: {
				set: (value) => {
					far = value;
				},
				get: () => {
					return far;
				}
			}
		}
	);

}

module.exports = { Camera };