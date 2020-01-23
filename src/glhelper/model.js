
const { Transformation } = require("../util/transformation");

function Model() {

	const transformation = Transformation(),
		  meshes = {};

	return Object.create(
		{
			draw: function(map) {

				const {matrix} = transformation;

				const draw = (key, mesh) => {

					const {callback, attributeLocations, instances} = map[key];

					if(callback)

						callback({
							matrix: Array.prototype.slice.call(matrix)
						});

					if(mesh)

						mesh.draw(attributeLocations, instances);

				};

				Object.keys(map).forEach(value => {

					if(value == "all") {
						Object.keys(meshes).forEach((value) => {
							draw("all", meshes[value]);
						});

					} else {
						draw(value, meshes[value]);

					}

				});

			},

			addMesh: function(name, value) {
				meshes[name] = value;
			}
		},
		{
			transformation: {
				get: function() {
					return transformation;
				}
			},

			meshes: {
				get: () => {
					return meshes; 
				}
			}
		}
	);

}

module.exports = { Model };