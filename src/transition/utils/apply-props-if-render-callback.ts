import { isValidElement, ReactNode } from 'react';

// @TODO I don't think the TS is correct...

type FunctionAsChild<T> = (arg: T) => ReactNode;
type FunctionOrReactNode<T> = FunctionAsChild<T> | ReactNode;

export function isRenderProp<T>(child: FunctionOrReactNode<T>) {
	return !isValidElement(child) && typeof child === 'function';
}

export function applyPropsIfRenderCallback<T>(child: FunctionOrReactNode<T>, propsToApply: T): ReactNode {
	if (isRenderProp(child)) {
		return (child as FunctionAsChild<T>)({ ...propsToApply });
	}
	return child as ReactNode;
}
