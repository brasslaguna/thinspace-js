
import { Mesh } from "../glhelper/mesh"
import { Model } from "../glhelper/model"

const Path = ({ context, vertices = []}) => {

	const {gl, Buffer} = context;

	const mesh = Mesh(gl),
		  model = Model();

	mesh.mode = gl.LINE_LOOP;

	mesh.update(
		(buffers) => {

			const vertex = Buffer(gl.ARRAY_BUFFER);

			vertex.data({
				usage: gl.STATIC_DRAW,
				offset: 0,
				size: vertices.length / 3,
				data: new Float32Array(vertices)
			});

			vertex.addAttribute(
				"position",
				{
					size: 3,
					type: gl.FLOAT,
					normalized: false,
					stride: Float32Array.BYTES_PER_ELEMENT * 3,
					offset: 0
				}
			);

			buffers.push(vertex);

		}
	);

	model.addMesh("path", mesh);

	return model;

};

export { Path };