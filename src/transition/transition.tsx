import React, { Component, createRef, ReactElement, ReactNode, RefObject } from 'react';
import { applyPropsIfRenderCallback } from './utils/apply-props-if-render-callback';
import { createEasing, Easing } from './utils/easing';
import { getPositionRelativeToParent, getPositionChanges, Position } from './utils/position';
import { convertStyleObjectToCSSText } from './utils/styles';

type FunctionAsChild = () => ReactNode;

type TransitionProps = {
	children: ReactNode | FunctionAsChild;
	className?: string;
	style?: React.CSSProperties,
}

type TransitionState = {
	isTransitioning: boolean;
}

type ChildComponent = (
	{
		children,
		style,
		className,
	}: {
		children: ReactNode;
		style?: React.CSSProperties;
		className?: string;
	}
) => ReactElement;

export class Transition extends Component<TransitionProps, TransitionState> {
	private _containerRef: RefObject<HTMLDivElement>;
	private _easing: Easing | undefined;
	static ReverseScale: ChildComponent;
	static PreserveAspectRatio: ChildComponent;

	constructor(props: TransitionProps) {
		super(props);
		this._containerRef = createRef();
	}

	state: TransitionState = {
		isTransitioning: false,
	};

	componentDidMount(): void {
		// console.log('MOUNT!');
		// const position = getPositionRelativeToParent(this._outerElementRef.current);
		// this._lastNextPosition = position;
	}

	getSnapshotBeforeUpdate(prevProps: Readonly<TransitionProps>, prevState: Readonly<TransitionState>) {
		if (!this._containerRef.current) {
			return null;
		}

		return getPositionRelativeToParent(this._containerRef.current);
	}

	componentDidUpdate(prevProps: Readonly<TransitionProps>, prevState: Readonly<TransitionState>, snapshot: Readonly<Position> | null): void {
		if (
			!this._containerRef.current ||
			!snapshot
		) {
			return;
		}

		const { style } = this.props;

		const trueOuterPosition = getPositionRelativeToParent(this._containerRef.current);
		const positionChanges = getPositionChanges(snapshot, trueOuterPosition);

		this._easing = createEasing(
			5000,
			() => {
				//
			},
			(delta) => {
				const gridArea = style?.gridArea ? `grid-area:${style.gridArea ?? ''}` : '';
				const cssTextArr = [gridArea];

				const transformTextArr = ['transform-origin: top left; transform:'];

				if (positionChanges.top || positionChanges.left) {
					const x = (snapshot.left - trueOuterPosition.left) * (1 - delta);
					const y = (snapshot.top - trueOuterPosition.top) * (1 - delta);

					if (positionChanges.top && positionChanges.left) {
						transformTextArr.push(`translate(${x}px, ${y}px)`);
					}
					else if (positionChanges.top) {
						transformTextArr.push(`translateY(${y}px)`);
					}
					else if (positionChanges.left) {
						transformTextArr.push(`translateX(${x}px)`);
					}
				}

				if (positionChanges.width || positionChanges.height) {
					// const changeInWidth = Math.abs(trueOuterPosition.width - snapshot.width);
					// const changeInHeight = Math.abs(trueOuterPosition.height - snapshot.height);

					const reverseScaleCssText = ['transform-origin: center center; transform:'];
					const preserveAspectCssText = ['transform-origin: center center; transform:'];

					const xScale = ((trueOuterPosition.width - snapshot.width) * delta + snapshot.width) / trueOuterPosition.width;
					const yScale = ((trueOuterPosition.height - snapshot.height) * delta + snapshot.height) / trueOuterPosition.height;

					if (positionChanges.width) {
						transformTextArr.push(`scaleX(${xScale})`);
						reverseScaleCssText.push(`scaleX(${1 / xScale})`);
					}

					if (positionChanges.height) {
						transformTextArr.push(`scaleY(${yScale})`);
						reverseScaleCssText.push(`scaleY(${1 / yScale})`);
					}

					const currentWidth = trueOuterPosition.width * xScale;
					const currentHeight = trueOuterPosition.height * yScale;

					const trueAspectRatio = trueOuterPosition.width / trueOuterPosition.height;
					// const currentAspectRatio = currentWidth / currentHeight;
					// console.log(trueAspectRatio, currentAspectRatio);

					// console.log('\n');
					// console.log('currentWidth', currentWidth, 'currentHeight', currentHeight);
					// console.log('trueWidth', trueOuterPosition.width, 'trueHeight', trueOuterPosition.height);
					// console.log('currentAspectRatio', currentAspectRatio, 'trueAspectRatio', trueAspectRatio);

					const toMeetScaleWidthCouldbeSetTo = currentHeight * trueAspectRatio;
					const toMeetScaleHeightCouldbeSetTo = currentWidth / trueAspectRatio;

					// console.log('toMeetScaleWidthCouldbeSetTo', toMeetScaleWidthCouldbeSetTo, 'OR toMeetScaleHeightCouldbeSetTo', toMeetScaleHeightCouldbeSetTo);

					if (toMeetScaleWidthCouldbeSetTo <= currentWidth) {
						const calc = toMeetScaleWidthCouldbeSetTo / currentWidth;
						preserveAspectCssText.push(`scaleX(${calc})`);
					}
					if (toMeetScaleHeightCouldbeSetTo <= currentHeight) {
						const calc = toMeetScaleHeightCouldbeSetTo / currentHeight;
						preserveAspectCssText.push(`scaleY(${calc})`);
					}
					// const offsetScaleY = actualWidth / (trueOuterPosition.width / trueOuterPosition.height) / actualHeight;
					// const offsetScaleX = actualHeight / (trueOuterPosition.height / trueOuterPosition.width) / actualWidth;

					this._containerRef.current?.querySelectorAll<HTMLElement>('.js-transition-reverse-scale').forEach(element => {
						let userStyle = JSON.parse(element.getAttribute('data-style') || '');
						userStyle = convertStyleObjectToCSSText(userStyle);
						const joined = [userStyle, reverseScaleCssText.join('')].join(';');
						element.style.cssText = joined;
					});

					this._containerRef.current?.querySelectorAll<HTMLElement>('.js-transition-preserve-aspect-ratio').forEach(element => {
						let userStyle = JSON.parse(element.getAttribute('data-style') || '');
						userStyle = convertStyleObjectToCSSText(userStyle);
						const joined = [userStyle, preserveAspectCssText.join('')].join(';');
						element.style.cssText = joined;
						// element.style.cssText = preserveAspectCssText.join('');
					});
				}

				cssTextArr.push(transformTextArr.join(''));

				if (this._containerRef.current) {
					this._containerRef.current.style.cssText = cssTextArr.join(';');
				}
			},
			() => {
				//
			}
		);

		this._easing.start();
	}

	componentWillUnmount(): void {
		//
	}

	render() {
		const { children, className, style } = this.props;
		const { isTransitioning } = this.state;

		return (
			<div
				style={{ ...style }}
				className={className}
				data-transition-element="container"
				ref={this._containerRef}
			>
				{applyPropsIfRenderCallback(children, { isTransitioning })}
			</div>
		);
	}
}

Transition.ReverseScale = function ReverseScale({ children, style = {} }) {
	const stringifiedStyle = JSON.stringify(style);
	return <div className='js-transition-reverse-scale' data-style={stringifiedStyle} style={style}>{children}</div>;
} as ChildComponent;

Transition.PreserveAspectRatio = function PreserveAspectRatio({ children, style = {} }) {
	const stringifiedStyle = JSON.stringify(style);
	return <div className='js-transition-preserve-aspect-ratio' data-style={stringifiedStyle} style={style}>{children}</div>;
} as ChildComponent;
