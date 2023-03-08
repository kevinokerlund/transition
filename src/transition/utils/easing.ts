export type Easing = {
	start: () => void;
	stop: () => void;
}

let queue: Ease[] = [];
let isRunning = false;

function loop(timestamp: number) {
	queue = queue.filter(easing => {
		return easing.run(timestamp);
	});

	if (queue.length) {
		window.requestAnimationFrame(loop);
	}
	else {
		isRunning = false;
	}
}

function run() {
	if (isRunning) {
		return;
	}
	window.requestAnimationFrame(loop);
	isRunning = true;
}

type time = number;
type onStart = () => void;
type during = (delta: number) => void;
type onEnd = () => void;

class Ease {
	time: time;
	onStart: onStart;
	during: during;
	onEnd: onEnd;
	hasStarted: boolean;
	stopped: boolean;
	firstTimestamp: number;

	constructor(time: number, onStart: onStart, during: during, onEnd: onEnd) {
		this.time = time;
		this.onStart = onStart;
		this.during = during;
		this.onEnd = onEnd;
		this.hasStarted = false;
		this.stopped = false;
		this.firstTimestamp = 0;
	}

	run(timestamp: number) {
		if (this.stopped) {
			return false;
		}

		if (!this.hasStarted) {
			this.firstTimestamp = timestamp;
			this.hasStarted = true;
			this.onStart();
		}

		const progress = timestamp - this.firstTimestamp;
		const delta = (x => Math.sin((x * Math.PI) / 2))(progress / this.time);

		if (progress < this.time) {
			this.during(delta);
			return true;
		}

		this.during(1);
		this.onEnd();
		return false;
	}

	stop() {
		this.stopped = true;
	}
}

export function createEasing(
	time: number,
	onStart: onStart,
	during: during,
	onEnd: onEnd,
): Easing {
	const easing = new Ease(time, onStart, during, onEnd);
	queue.push(easing);

	return {
		start() {
			run();
		},
		stop() {
			easing.stop();
		},
	};
}
