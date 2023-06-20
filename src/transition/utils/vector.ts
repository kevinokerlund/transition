
/**
 * Class that supports basic Vector math
 */
export class Vector {
    #values: number[];

    constructor(...values: number[]) {
        this.#values = values;
    }

    multiply(scalar: number) {
        return new Vector(...this.#values.map(v => v * scalar));
    }

    add(vector: Vector) {
        this.#assertSameLength(vector);
        return new Vector(...this.#values.map((v, i) => v + vector.#values[i]));
    }

    dot(vector: Vector) {
        this.#assertSameLength(vector);
        return this.#values.reduce((acc, curr, i) => acc + curr * vector.#values[i], 0);
    }

    get(index: number) {
        return this.#values[index];
    }

    #assertSameLength(vector: Vector) {
        assert(vector.#values.length, this.#values.length, 'The lengths of the vectors mismatch.');
    }
}

function assert(value1: any, value2: any, message?: string) {
    if (value1 !== value2) {
        throw new Error(message);
    }
}

export function test() {
    // Testing dot product
    assert((new Vector(1, 0)).dot(new Vector(0, 1)), 0, 'Failed dot product');
    assert((new Vector(1, 1)).dot(new Vector(0, 1)), 1, 'Failed dot product');
    assert((new Vector(2, 1)).dot(new Vector(1, 3)), 5, 'Failed dot product');
    // Testing addition
    const resultAdd = (new Vector(4, 1)).add(new Vector(3, 2));
    assert(resultAdd.get(0), 7, 'Failed addition');
    assert(resultAdd.get(1), 3, 'Failed addition');
    // Testing multiplying by a scalar 
    const resultMultiplication = (new Vector(4, 1)).multiply(5);
    assert(resultMultiplication.get(0), 20, 'Failed scalar multiplication');
    assert(resultMultiplication.get(1), 5, 'Failed scalar multiplication');
}
