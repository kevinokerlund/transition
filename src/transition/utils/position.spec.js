import { getPositionRelativeToParent, getPositionChanges } from './position';

describe('position utils', () => {
	describe('getPositionRelativeToParent()', () => {
		beforeEach(() => {
			// @TODO Figure out the proper way to do this
			// eslint-disable-next-line no-undef
			Object.defineProperty(global, 'document', {
				value: {
					body: {
						getBoundingClientRect() {
							return {
								top: 1,
								left: 1,
							};
						},
					},
				},
			});
		});

		test('should return an object with the width, height, top and left properties of an element relative to the body', () => {
			const result = getPositionRelativeToParent({
				getBoundingClientRect() {
					return {
						width: 10,
						height: 10,
						top: 10,
						left: 10,
					};
				},
			});
			expect(result).toEqual({
				width: 10,
				height: 10,
				top: 9,
				left: 9,
			});
		});
	});

	describe('getPositionChanges()', () => {
		let position1 = {};
		let position2 = {};
		beforeEach(() => {
			position1 = {
				width: 10,
				height: 10,
				top: 0,
				left: 0,
			};

			position2 = {
				width: 10,
				height: 10,
				top: 0,
				left: 0,
			};
		});

		test('should return false for all properties if none changed', () => {
			// @TODO, auto (quick fix) import does not work.
			const changes = getPositionChanges(position1, position2);
			expect(changes).toEqual({
				some: false,
				width: false,
				height: false,
				top: false,
				left: false
			});
		});

		test('should return false for "some" and "width" when the width is different', () => {
			position2.width = 20;
			const changes = getPositionChanges(position1, position2);
			expect(changes).toEqual({
				some: true,
				width: true,
				height: false,
				top: false,
				left: false
			});
		});

		test('should return false for "some" and "height" when the height is different', () => {
			position2.height = 20;
			const changes = getPositionChanges(position1, position2);
			expect(changes).toEqual({
				some: true,
				width: false,
				height: true,
				top: false,
				left: false
			});
		});

		test('should return false for "some" and "top" when the top is different', () => {
			position2.top = 100;
			const changes = getPositionChanges(position1, position2);
			expect(changes).toEqual({
				some: true,
				width: false,
				height: false,
				top: true,
				left: false
			});
		});

		test('should return false for "some" and "left" when the left is different', () => {
			position2.left = 100;
			const changes = getPositionChanges(position1, position2);
			expect(changes).toEqual({
				some: true,
				width: false,
				height: false,
				top: false,
				left: true
			});
		});
	});
});
