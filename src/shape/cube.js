
import { Mesh } from "../glhelper/mesh"
import { Model } from "../glhelper/model"
import { Transformation } from "../util/transformation"
import { PlaneBuffer } from "./plane"

import { vec3 } from "gl-matrix"

const Cube = ({ context, res = 2 }) => {

	const {gl, Buffer} = context;

	const transformation = Transformation();

	const modified = {

		vertex: [],
		index: []

	};

	[
		{ translation: [0, 0, -0.5], rotation: [0, 0, 0] },
		{ translation: [-0.5, 0, 0], rotation: [0, -90, 0] },
		{ translation: [0, 0, 0.5], rotation: [0, -180, 0] },
		{ translation: [0.5, 0, 0], rotation: [0, 90, 0] },
		{ translation: [0, 0.5, 0], rotation: [90, 0, 0] },
		{ translation: [0, -0.5, 0], rotation: [90, 0, 0] }
	]
		.forEach(({translation, rotation}, i) => {

			const buffer = PlaneBuffer(res, res);

			transformation.translation = translation;
			transformation.rotation = rotation;

			for(let j = 0; j < buffer.vertices.length; j += 8) {

				const vertex = buffer.vertices.slice(j, j+3);

				modified.vertex.push(

					...vec3.transformMat4(
						vec3.create(),
						vertex,
						transformation.matrix
					),

					...buffer.vertices.slice(j+3, j+8)

				);

			}

			const max = Math.max(...buffer.indices);

			modified.index.push(

				...buffer.indices.map(value => {

					return value + ((max * i) + max);

				})

			);

		});


	const vertex = Buffer(gl.ARRAY_BUFFER);
	const index = Buffer(gl.ELEMENT_ARRAY_BUFFER);

	vertex.data({

		usage: gl.STATIC_DRAW,
		offset: 0,
		size: modified.vertex.length / 8,
		data: new Float32Array(modified.vertex)

	});

	vertex.addAttribute(
		"position",
		{
			size: 3,
			type: gl.FLOAT,
			normalized: false,
			stride: Float32Array.BYTES_PER_ELEMENT * 8,
			offset: 0
		}
	);

	vertex.addAttribute(
		"normal",
		{
			size: 3,
			type: gl.FLOAT,
			normalized: false,
			stride: Float32Array.BYTES_PER_ELEMENT * 8,
			offset: Float32Array.BYTES_PER_ELEMENT * 3
		}
	);

	vertex.addAttribute(
		"texture",
		{
			size: 2,
			type: gl.FLOAT,
			normalized: false,
			stride: Float32Array.BYTES_PER_ELEMENT * 8,
			offset: Float32Array.BYTES_PER_ELEMENT * 6
		}
	);

	index.data({

		usage: gl.STATIC_DRAW,
		offset: 0,
		size: modified.index.length,
		data: new Uint16Array(modified.index)

	});

	const mesh = Mesh(gl);

	mesh.mode = gl.TRIANGLES;

	mesh.update((buffers) => {

		buffers.push(vertex, index);

	});

	const model = Model();

	model.addMesh("cube", mesh);

	return model;

};

export { Cube };