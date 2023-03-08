import { isValidElement } from 'react';

export function applyPropsIfRenderCallback(child, propsToApply) {
	if (!isValidElement(child) && typeof child === 'function') {
		return child({ ...propsToApply });
	}
	return child;
}
