export interface Position {
	width: number;
	height: number;
	top: number;
	left: number;
}

export interface PositionChanges {
	some: boolean;
	width: boolean;
	height: boolean;
	top: boolean;
	left: boolean;
}

export function getPositionRelativeToParent(element: HTMLElement): Position {
	const { top: parentTop, left: parentLeft } = document.body.getBoundingClientRect();

	const elementBox = element.getBoundingClientRect();
	const { width, height, top, left } = elementBox;

	return {
		width,
		height,
		top: top - parentTop,
		left: left - parentLeft,
	};
}

export function getPositionChanges(previousPosition: Position, nextPosition: Position): PositionChanges {
	// The browser does some stupid floating crap here... it can be different... might beed to adjust
	const width = previousPosition.width !== nextPosition.width;
	const height = previousPosition.height !== nextPosition.height;
	const top = previousPosition.top !== nextPosition.top;
	const left = previousPosition.left !== nextPosition.left;

	return {
		some: width || height || top || left,
		width,
		height,
		top,
		left,
	};
}
