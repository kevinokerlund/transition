import { cubicBezier } from './cubic-bezier';
import { Vector } from './vector';

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
type EaseFunction = (t: number) => number;

// From MDN: cubic-bezier(0.0, 0.0, 0.58, 1.0) https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function
const easeOut = cubicBezier(new Vector(0, 0), new Vector(0.58, 1.0));
// From MDN: cubic-bezier(0.42, 0.0, 1.0, 1.0) https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function
const easeIn = cubicBezier(new Vector(0.42, 0), new Vector(1.0, 1.0));
// From MDN: cubic-bezier(0.42, 0.0, 0.58, 1.0) https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function
const easeInOut = cubicBezier(new Vector(0.42, 0), new Vector(0.58, 1.0));
// Uses sin curve to ease out as d/dx of sin(x) is cos(x) so rate of change slows as x -> pi/2
const sinEaseOut: EaseFunction = x => Math.sin((x * Math.PI) / 2);

class Ease {
	time: time;
	onStart: onStart;
	during: during;
	onEnd: onEnd;
	hasStarted: boolean;
	stopped: boolean;
	firstTimestamp: number;
	easeFunction: EaseFunction;

	constructor(time: number, onStart: onStart, during: during, onEnd: onEnd, easeFunction: EaseFunction = sinEaseOut) {
		this.time = time;
		this.onStart = onStart;
		this.during = during;
		this.onEnd = onEnd;
		this.hasStarted = false;
		this.stopped = false;
		this.firstTimestamp = 0;
		this.easeFunction = easeFunction;
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
		const delta = this.easeFunction(progress / this.time);

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
