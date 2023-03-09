import React from 'react';

function camelCaseToKebabCase(camelCaseString: string) {
	return camelCaseString.replace(/([A-Z])/g, (m, c) => {
		return `-${c.toLowerCase()}`;
	});
}

function convertCssObjectToCssText(styleObject: React.CSSProperties): string {
	return Object
		.entries(styleObject)
		.map(([key, value]) => [camelCaseToKebabCase(key), value].join(':'))
		.join(';');
}

export class InlineStyles {
	styles: React.CSSProperties;

	constructor(initialStyles: React.CSSProperties = {}) {
		this.styles = { ...initialStyles };
	}

	remove(property: keyof React.CSSProperties) {
		delete this.styles[property];
		return this;
	}

	merge(styles: (React.CSSProperties | InlineStyles)) {
		if (styles instanceof InlineStyles) {
			styles = styles.styles;
		}

		this.styles = {
			...this.styles,
			...styles,
		};
		return this;
	}

	toCssText() {
		return convertCssObjectToCssText(this.styles);
	}
}

export class Transform {
	transformOrigin: string;
	transform: {
		scaleX?: string;
		scaleY?: string;
		translateX?: string;
		translateY?: string;
	};

	constructor(origin = '') {
		this.transformOrigin = origin;
		this.transform = {};
	}

	origin(origin: string) {
		this.transformOrigin = origin;
		return this;
	}

	scaleX(x: string) {
		this.transform.scaleX = x;
		return this;
	}

	scaleY(y: string) {
		this.transform.scaleY = y;
		return this;
	}

	scale(x: string, y: string) {
		this.scaleX(x);
		this.scaleY(y);
		return this;
	}

	translateX(x: string) {
		this.transform.translateX = x;
		return this;
	}

	translateY(y: string) {
		this.transform.translateY = y;
		return this;
	}

	translate(x: string, y: string) {
		this.translateX(x);
		this.translateY(y);
		return this;
	}

	toObject(): { transform: string; 'transform-origin'?: string } {
		const transform = Object
			.entries(this.transform)
			.reduce<string[]>((acc, [key, value]) => {
				if (value) {
					acc.push(`${key}(${value})`);
				}
				return acc;
			}, [])
			.join('');

		return {
			transform,
			...(this.transformOrigin ? { 'transform-origin': this.transformOrigin } : {})
		};
	}
}
