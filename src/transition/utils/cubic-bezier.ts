import { Vector } from './vector';

/**
 * Used to create a cubic bezier easing function. Where to lookup equation https://en.wikipedia.org/wiki/B%C3%A9zier_curve
 * Points zero and three are the start and end points. In CSS, these are (0, 0) and (1, 1) respectively.
 * Here's a cubic bezier editor for CSS https://cubic-bezier.com/. In CSS, first two values are the first control point and the last two are the second.
 * @param controlPointOne 
 * @param controlPointTwo 
 * @returns a cubic bezier easing function
 */
export function cubicBezier(controlPointOne: Vector, controlPointTwo: Vector) {
    /**
     * @param t 0 <= t <= 1
     */
    return function ease(t: number) {
        // first term drops out as P_0 is (0, 0)
        const secondTerm = controlPointOne.multiply(3 * t * (1 - t) ** 2);
        const thirdTerm = controlPointTwo.multiply(3 * (1 - t) * t ** 2);
        const fourthTerm = new Vector(1, 1).multiply(t ** 3);
        const position =  secondTerm.add(thirdTerm).add(fourthTerm);
        // returning y component
        return position.get(1);
    }
}
