
const math = {

	plotOnCircle: (origin, angle, radius) => {

		return [
			origin[0] + Math.cos(angle) * radius[0],
			origin[1] + Math.sin(angle) * radius[1],
			origin[2]
		];

	},

	circle: (origin, radius, resolution, clockwise = true) => {

		let out = [];

		for(let i = 0; i < resolution; i++) {

			let angle = (i/resolution) * (Math.PI * 2);

			out = out.concat(
				math.plotOnCircle(origin, (clockwise) ? angle : (Math.PI * 2) - angle, radius)
			);
		}

		return out;

	},

	clamp: (value, min, max) => {

		return (value < min) ? min : (value > max) ? max : value;

	},

	magnitude: (a, b) => {

		return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2));

	},

	angle: (a, b) => {

		return Math.atan2(b[1] - a[1], b[0] - a[0]);

	}

};

module.exports = { math };