import { useEffect, useState } from 'react';

interface Props {
	speedFactor?: number;
	backgroundColor?: string;
	starColor?: [number, number, number];
	starCount?: number;
}

export let setChar: React.Dispatch<React.SetStateAction<string[]>>;

export default function GameTextbg(props: Props) {
	const { speedFactor = 0.05, backgroundColor = 'black', starColor = [255, 255, 255], starCount = 5000 } = props;

	const [charQueue, setCharQueue] = useState<string[]>([]);

	// Exported function to push characters into the queue
	setChar = setCharQueue;

	function moveText() {
		const canvas = document.getElementById('textbg') as HTMLCanvasElement;
		let charDone = 0;
		if (canvas) {
			const c = canvas.getContext('2d');

			if (c) {
				let w = window.innerWidth;
				let h = window.innerHeight;

				const setCanvasExtents = () => {
					canvas.width = w;
					canvas.height = h;
				};

				setCanvasExtents();

				window.onresize = () => {
					setCanvasExtents();
				};

				let chars = [];

				for(let i=charDone;i<charQueue.length;i++){
					chars.push({
						x: Math.random() * 1600 - 800,
						y: Math.random() * 900 - 450,
						z: Math.random() * 1000,
						text: charQueue[i]
					})
					charDone++;
				}

				const clear = () => {
					c.fillStyle = backgroundColor;
					c.fillRect(0, 0, canvas.width, canvas.height);
				};

				const putPixel = (x: number, y: number, brightness: number, ch: string) => {
					const rgb = 'rgba(' + starColor[0] + ',' + starColor[1] + ',' + starColor[2] + ',' + brightness + ')';
					c.fillStyle = rgb;
					c.font = "20px Arial"; // Set the font size and type
					c.fillText(ch, x, y);
				};

				const moveChars = (distance: number) => {
					const count = chars.length;
					for (var i = 0; i < count; i++) {
						const s = chars[i];
						s.z -= distance;
						while (s.z <= 1) {
							s.z += 1000;
						}
					}
				};

				let prevTime: number;
				const init = (time: number) => {
					prevTime = time;
					requestAnimationFrame(tick);
				};

				const tick = (time: number) => {
					let elapsed = time - prevTime;
					prevTime = time;

					moveChars(elapsed * speedFactor);

					clear();

					const cx = w / 2;
					const cy = h / 2;

					const count = chars.length;
					for (var i = 0; i < count; i++) {
						const charObj = chars[i];

						const x = cx + charObj.x / (charObj.z * 0.001);
						const y = cy + charObj.y / (charObj.z * 0.001);

						if (x < 0 || x >= w || y < 0 || y >= h) {
							continue;
						}

						const d = charObj.z / 1000.0;
						const b = 1 - d * d;

						putPixel(x, y, b, charObj.text);
					}

					requestAnimationFrame(tick);
				};

				requestAnimationFrame(init);

				window.addEventListener('resize', function () {
					w = window.innerWidth;
					h = window.innerHeight;
					setCanvasExtents();
				});
			} else {
				console.error('Could not get 2d context from canvas element');
			}
		} else {
			console.error('Could not find canvas element with id "textbg"');
		}

		return () => {
			window.onresize = null;
		};
	}

	useEffect(() => {
		moveText();
	}, [charQueue]);

	return (
		<canvas
			id="textbg"
			style={{
				padding: 0,
				margin: 0,
				position: 'fixed',
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
				zIndex: 0,
				opacity: 1,
				pointerEvents: 'none',
				mixBlendMode: 'screen',
			}}
		></canvas>
	);
}
