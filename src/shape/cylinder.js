
import { Mesh } from "../glhelper/mesh"
import { Model } from "../glhelper/model"
import { math } from "../util/math"
import { Transformation } from "../util/transformation"

const Cylinder = ({context, res, height, segments = 1}) => {

	const {gl, Buffer} = context;

	const model = Model(),
		  vertices = [],
		  indices = [];

	height = height/segments;

	for(let i = 0; i < segments; i++) {

		const band = Band({
			origin: [0, 0, i * height],
			radius: [1, 1],
			segIndex: i,
			height,
			res
		});

		vertices.push(...band.vertices);
		indices.push(...band.indices);

	}

	model.addMesh(
		"body", 
		BodyMesh({
			context, 
			vertices, 
			indices
		})
	);

	for(let i = 0; i < 2; i++)

		model.addMesh(
			(!i) ? "topCap" : "bottomCap", 
			CapMesh({
				context, 
				origin: [0, 0, (!i) ? segments * height : 0],
				radius: [1, 1],
				facingTop: !i,
				res
			})
		);

	return model;

};

const BodyMesh = ({context, vertices, indices}) => {

	const {gl, Buffer} = context;

	const mesh = Mesh(gl);

	mesh.mode = gl.TRIANGLES;

	mesh.update(
		(buffers) => {

			const vertex = Buffer(gl.ARRAY_BUFFER),
				  element = Buffer(gl.ELEMENT_ARRAY_BUFFER);

			vertex.data({
				usage: gl.STATIC_DRAW,
				offset: 0,
				size: vertices.length / 8,
				data: new Float32Array(vertices)
			});

			element.data({
				usage: gl.STATIC_DRAW,
				offset: 0,
				size: indices.length,
				data: new Uint16Array(indices)
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
					offset: Float32Array.BYTES_PER_ELEMENT * 5
				}
			);

			buffers.push(vertex, element);

		}
	);

	return mesh;

};

const CapMesh = ({context, origin, radius, res, facingTop = true}) => {

	const {gl, Buffer} = context;

	const mesh = Mesh(gl),
		  circle = math.circle(origin, radius, res, facingTop),
		  vertices = [];

	mesh.mode = gl.TRIANGLE_FAN;

	circle.unshift(...origin);
	circle.push(...circle.slice(3, 6));

	for(let i = 0; i < circle.length/3; i++) {

		const vertex = circle.slice(i*3, (i*3)+3);

		vertices.push(
			...vertex,
			...[vertex[0], vertex[1], (facingTop) ? 1 : -1],
			vertex[0] - 0.5,
			vertex[1] - 0.5
		);

	}

	mesh.update(
		(buffers) => {

			const vertex = Buffer(gl.ARRAY_BUFFER);

			vertex.data({
				usage: gl.STATIC_DRAW,
				offset: 0,
				size: vertices.length / 8,
				data: new Float32Array(vertices)
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
					offset: Float32Array.BYTES_PER_ELEMENT * 5
				}
			);

			buffers.push(vertex);

		}
	);

	return mesh;

};

const Band = ({origin, radius, res, height, taper = 1, segIndex = 0}) => {

	const circle = math.circle(origin, radius, res),
		  total = circle.length/3;

	const vertices = [],
		indices = [],
		quadIndices = [];

	const odd = total % 2 == 1;

	for(let i = 0; i < total; i += 2) {

		let index = i*3;

		const end = i + 2 >= total,
			  tl = circle.slice(index, index+3);

		if(end && odd) index = 0;

		const tr = circle.slice(index+3, index+6),

			  vertex = [
	  			tl,
				tr,
				[tr[0] * taper, tr[1] * taper, tr[2] + height],
				[tl[0] * taper, tl[1] * taper, tl[2] + height]
			  ];

		vertices.push(

			...vertex[0], ...vertex[0], ...[i/total, 1],
			...vertex[1], ...vertex[1], ...[(i+1)/total, 1],
			...vertex[2], ...vertex[2], ...[(i+1)/total, 0],
			...vertex[3], ...vertex[3], ...[i/total, 0]

		);

	 	index = (i/2) * 4;

	 	index += (Math.ceil(total / 2) * 4) * segIndex;

		quadIndices.push([
			index, index + 1, index + 2,
			index + 2, index + 3, index
		]);

	}

	for(let i = 0; i < total; i++) {

		const even = i % 2 == 0,
			  end = i == total - 1;

		if(even && !end) {
			indices.push(...quadIndices[i/2]);
			continue;
		}

		if(!even || end) {

			const index = (i-1)/2;

			const pre = (end) ? indices.slice(-6) : quadIndices[index],
				  quad = (end) ? quadIndices[0] : quadIndices[index+1];

			indices.push(
				pre[1], quad[0], quad[4],
				quad[4], pre[2], pre[1]
			);

		}

	}

	return {
		vertices,
		indices
	};

};

export { Cylinder, Band, BodyMesh, CapMesh };