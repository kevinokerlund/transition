import React, { Component, createRef, ReactElement, ReactNode, RefObject } from 'react';
import { applyPropsIfRenderCallback } from './utils/apply-props-if-render-callback';
import { createEasing, Easing } from './utils/easing';
import { getPositionRelativeToParent, getPositionChanges, Position } from './utils/position';
import { InlineStyles, Transform } from './utils/styles';

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
				const containerStyles = new InlineStyles({
					gridArea: style?.gridArea ?? '',
				});

				const outerTransform = new Transform('top left');

				if (positionChanges.top || positionChanges.left) {
					const x = (snapshot.left - trueOuterPosition.left) * (1 - delta);
					const y = (snapshot.top - trueOuterPosition.top) * (1 - delta);

					if (positionChanges.top && positionChanges.left) {
						outerTransform.translate(`${x}px`, `${y}px`);
					}
					else if (positionChanges.top) {
						outerTransform.translateY(`${y}px`);
					}
					else if (positionChanges.left) {
						outerTransform.translateX(`${x}px`);
					}
				}

				if (positionChanges.width || positionChanges.height) {
					// const changeInWidth = Math.abs(trueOuterPosition.width - snapshot.width);
					// const changeInHeight = Math.abs(trueOuterPosition.height - snapshot.height);

					const reverseScaleTransform = new Transform('center center');
					const preserveAspectTransform = new Transform('center center');

					const xScale = ((trueOuterPosition.width - snapshot.width) * delta + snapshot.width) / trueOuterPosition.width;
					const yScale = ((trueOuterPosition.height - snapshot.height) * delta + snapshot.height) / trueOuterPosition.height;

					if (positionChanges.width) {
						outerTransform.scaleX(`${xScale}`);
						reverseScaleTransform.scaleX(`${1 / xScale}`);
					}

					if (positionChanges.height) {
						outerTransform.scaleY(`${yScale}`);
						reverseScaleTransform.scaleY(`${1 / yScale}`);
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
						preserveAspectTransform.scaleX(`${calc}`);
					}
					if (toMeetScaleHeightCouldbeSetTo <= currentHeight) {
						const calc = toMeetScaleHeightCouldbeSetTo / currentHeight;
						preserveAspectTransform.scaleY(`${calc}`);
					}
					// const offsetScaleY = actualWidth / (trueOuterPosition.width / trueOuterPosition.height) / actualHeight;
					// const offsetScaleX = actualHeight / (trueOuterPosition.height / trueOuterPosition.width) / actualWidth;

					[
						['.js-transition-reverse-scale', reverseScaleTransform],
						['.js-transition-preserve-aspect-ratio', preserveAspectTransform],
					]
						.forEach(([selector, transform]) => {
							this._containerRef.current?.querySelectorAll<HTMLElement>(selector as string).forEach(element => {
								const userStyle = JSON.parse(element.getAttribute('data-style') || '');
								const styles = new InlineStyles(userStyle).merge((transform as Transform).toObject()).toCssText();
								element.style.cssText = styles;
							});
						});
				}

				if (this._containerRef.current) {
					this._containerRef.current.style.cssText = containerStyles.merge(outerTransform.toObject()).toCssText();
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
