
import { Model } from "../glhelper/model"
import { Band, BodyMesh, CapMesh } from "../shape/cylinder"

const Cone = ({
	context, 
	res, 
	height, 
	taper = 1, 
	segments = 1, 
	buffer = (value) => { return value; }}

	) => {

	const calculateTaper = (i) => {
		return 1 - (((i)/segments) * (1 - taper));
	};

	let model = Model(),
		  vertices = [],
		  indices = [];

	height = height/segments;

	for(let i = 0; i < segments; i++) {

		const segTaper = calculateTaper(i);
		
		const band = Band({
			origin: [0, 0, i * height],
			radius: [segTaper, segTaper],
			segIndex: i,
			taper: calculateTaper(i + 1) / segTaper,
			height,
			res
		});

		vertices.push(...band.vertices);
		indices.push(...band.indices);
	}

	vertices = buffer(vertices);

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
				radius: (!i) ? [taper, taper] : [1, 1],
				facingTop: !i,
				res
			})
		);


	return model;

};

export { Cone };
