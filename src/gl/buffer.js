
function Buffer(gl, target, extensions) {

	const id = gl.createBuffer();
	let size = 0;

	const vertexAttributes = {};

	return Object.create(
		{
			draw: function({mode, instances = 0, first = 0, count = size}) {

				this.bind();

				switch(target) {

					case gl.ARRAY_BUFFER:

						if(!instances) {
							gl.drawArrays(mode, first, count);

						} else {
							extensions("drawArraysInstancedANGLE", mode, first, count, instances);

						}
		
						break;

					case gl.ELEMENT_ARRAY_BUFFER:

						if(!instances) {
							gl.drawElements(mode, count, gl.UNSIGNED_SHORT, first);

						} else {
							extensions("drawElementsInstancedANGLE", mode, count, gl.UNSIGNED_SHORT, first, instances);

						}
				}
				
			},

			setVertexAttribPointer: function (attributeLocations = {}) {

				const set = (attribute, location, index) => {

					const {size, type, normalized, stride, offset, divisor = 0} = attribute;

					gl.enableVertexAttribArray(location + index);

					gl.vertexAttribPointer(
						location + index,
						size,
						type,
						normalized,
						stride,
						offset
					);

					extensions("vertexAttribDivisorANGLE", location + index, divisor);

				};

				this.bind();

				Object.keys(attributeLocations).forEach(value => {

					(vertexAttributes[value] || []).forEach((attribute, index) => {

						set(attribute, attributeLocations[value], index);

					});

				});

			},

			bind: function() {
				gl.bindBuffer(target, id);
			},

			delete: function() {

				for(let i = 0; i < gl.getParameter(gl.MAX_VERTEX_ATTRIBS); i++)
					gl.disableVertexAttribArray(i);

				gl.deleteBuffer(id);

			},

			data: function(args) {

				this.bind();

				size = args.size;

				gl.bufferData(
					target, 
					args.data,
					args.usage, 
					args.offset
				);
			},

			update: function(args) {

				this.bind();

				size = args.size || size;

				gl.bufferSubData(
					target,
					args.offset,
					args.data
				);

			},

			addAttribute: (name, attribute, arrayIndex = 0) => {

				if(!vertexAttributes[name])
					vertexAttributes[name] = [];

				vertexAttributes[name][arrayIndex] = attribute;

			}
		}
	);

}

export { Buffer };