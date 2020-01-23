
const { Mesh } = require("../glhelper/mesh");
const { Model } = require("../glhelper/model");

const Sphere = ({context, resX, resY}) => {

	const {gl, Buffer} = context;

	const updateMesh = () => {

		mesh.update(
			(buffers) => {

				for(let i = buffers.length; i > 0; i--) {
					buffers[i].delete();
					buffers.pop();
				}

				const buffers_ = SphereBuffer({resX, resY});

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

	}

	const model = Model(),
		  mesh = Mesh(gl);

	mesh.mode = gl.TRIANGLES;

	updateMesh();

	model.addMesh("body", mesh);

	return model;

}

const SphereBuffer = ({resX, resY}) => {

	let vertices = [],
		indices = [],

		index = 0,
		indexRows = [],
		grid = [];

	const theta = Math.PI,
		  phi = theta * 2;

	for(let i = 0; i <= resY; i++) {

		indexRows = [];

		const y = i / resY;

		for(let j = 0; j <= resX; j++) {

			const x = j / resX,

				  xProgress = x * phi,
				  yProgress = y * theta;

			let vertex = [
				-Math.cos(xProgress) * Math.sin(yProgress),
				Math.cos(yProgress),
				Math.sin(xProgress) * Math.sin(yProgress)
			];

			vertices = vertices.concat([
				...vertex,
				...vertex,
				x, y
			]);

			indexRows.push(index++);

		}

		grid = grid.concat(indexRows);

	}

	for(let i = 0; i <= resY; i++) {

		const row = i * resY;

		for(let j = 0; j <= resX; j++) { 

			let a, b, c, d;

			a = grid[row + j + 1];
			b = grid[row + j];
			c = grid[(row + resY) + j];
			d = grid[(row + resY) + j + 1];

			if(i !== 0)
				indices.push(a, b, d);

			indices.push(b, c, d);

		}

	}

	return {
		vertices: new Float32Array(vertices),
		indices: new Uint16Array(indices)
	};

};

module.exports = { Sphere, SphereBuffer };