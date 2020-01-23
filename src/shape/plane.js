
const { Mesh } = require("../glhelper/mesh");
const { Model } = require("../glhelper/model");

const Plane = ({context, resX, resY}) => {

	const {gl, Buffer} = context;

	const updateMesh = () => {

		mesh.update(
			(buffers) => {

				for(let i = buffers.length; i > 0; i--) {
					buffers[i].delete();
					buffers.pop();
				}

				const buffers_ = PlaneBuffer(resX, resY);

				for(let key in buffers_) {

					const value = buffers_[key],
						  buffer = Buffer(
							(key == "vertices") ? gl.ARRAY_BUFFER : gl.ELEMENT_ARRAY_BUFFER
						  );

					buffer.data({
						usage: gl.STATIC_DRAW,
						size: (key == "vertices") ? value.length / 8 : value.length,
						offset: 0,
						data: value
					});

					buffers.push(buffer);
				}

				const buffer = buffers[0];

				buffer.addAttribute(
					"position",
					{
						size: 3,
						type: gl.FLOAT,
						normalized: false,
						stride: Float32Array.BYTES_PER_ELEMENT * 8,
						offset: 0
					}
				);

				buffer.addAttribute(
					"normal",
					{
						size: 3,
						type: gl.FLOAT,
						normalized: false,
						stride: Float32Array.BYTES_PER_ELEMENT * 8,
						offset: Float32Array.BYTES_PER_ELEMENT * 3
					}
				);

				buffer.addAttribute(
					"texture",
					{
						size: 2,
						type: gl.FLOAT,
						normalized: false,
						stride: Float32Array.BYTES_PER_ELEMENT * 8,
						offset: Float32Array.BYTES_PER_ELEMENT * 6
					}
				);

			}
		);

	};

	const model = Model(),
		  mesh = Mesh(gl);

	mesh.mode = gl.TRIANGLES;

	updateMesh();

	model.addMesh("plane", mesh);

	return model;

};

const PlaneBuffer = (resX, resY) => {

	let vertices = [],
		indices = [];

	for(let i = 0; i < resX * resY; i++) {

		let x = i % resX,
			y = Math.floor(i / resY),

			xClamp = ((x / (resX - 1)) - 0.5) * 2,
			yClamp = ((y / (resY - 1)) - 0.5) * 2;

		vertices = vertices.concat([

			xClamp, yClamp, 0,

			0, 0, 1,

			x / (resX - 1),
			y / (resY - 1)

		]);

		if(x != resX - 1 && y != resY - 1)

			indices = indices.concat([

				resX * y + x,
				resX * y + x + resX,
				resX * y + x + resX + 1,
				resX * y + x,
				resX * y + x + resX + 1,
				resX * y + x + 1

			]);

	}

	return {
		vertices: new Float32Array(vertices),
		indices: new Uint16Array(indices)
	};

};

module.exports = { Plane, PlaneBuffer };