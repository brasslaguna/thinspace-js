
import { Transformation } from "../util/transformation"
import { mat4 } from "gl-matrix"

function Light(transformation = Transformation()) {

	const shadow = { color: [0, 0, 0] };

	return Object.create(
		{
			transformation,

			view: (center) => {

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
			shadow: {
				get: () => {
					return shadow;
				}
			}
		}
	);
}

export { Light };