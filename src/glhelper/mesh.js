
function Mesh(gl) {

	const vao = gl.createVertexArray(),
		  buffers = [];
		  
	let mode = gl.TRIANGLES;
		  
	return Object.create(
		{
			draw: function(attributeLocations = {}, instances) {

				const {length} = buffers;

				if(length) {

					if(vao)
						gl.bindVertexArray(vao);

					buffers[0].setVertexAttribPointer(attributeLocations);
					buffers[length - 1].draw({ mode, instances });
					

					if(vao)
						gl.bindVertexArray(null);
				}

			},

			update: function(callback) {

				if(vao)
					gl.bindVertexArray(vao);

				callback(buffers);

				if(vao)
					gl.bindVertexArray(null);
			},

			delete: function() {

				if(vao)
					gl.deleteVertexArray(vao);

			}
		},
		{
			mode: {
				set: function(value) {
					mode = value;
				},
				get: function() {
					return mode;
				}
			}
		}
	);

}

module.exports = { Mesh };