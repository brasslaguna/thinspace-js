
function Timer(fps = 24) {

	let id, cancel = false;

	return Object.create(

		{
			run: func => {

				cancel = false;

				let start,
					elapsed = 0,
					times = 0;

				let frequency = 1000/fps;

				const step = timestamp => {

					if(cancel)

						return;

					if(!start)

						start = timestamp;

					elapsed = timestamp - start;

					if(elapsed - (frequency * times) > frequency) {

						times++;
						func(elapsed, times);

					}

					id = requestAnimationFrame(step);

				};

				id = requestAnimationFrame(step);

			},

			stop: () => {

				cancel = true;

				cancelAnimationFrame(id);

			}
		},

		{
			fps: {

				set: value => {

					fps = value;

				}

			},

			running: {

				get: () => !cancel

			}
		}

	);
	
}

export { Timer }
