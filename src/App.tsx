import React, { useState } from 'react';
import { Transition } from './transition';
import './App.css';

function App() {
	const [render, setRender] = useState(0);
	const [bool, setBool] = useState(true);
	const [otherBool, setOtherBool] = useState(true);

	const newBoxClassName = otherBool ? 'other-box-small' : 'other-box-large';

	return (
		<div className="App">
			<button onClick={() => setRender(window.performance.now())}>Re-render</button>
			<button onClick={() => setBool(!bool)}>Swap Layout</button>
			<button onClick={() => setOtherBool(!otherBool)}>Swap Other Bool</button>

			<Transition className={'other-box ' + newBoxClassName} style={{position: 'relative'}}>
				<div style={{border: '1px solid black'}}>
					<Transition.ReverseScale style={{transformOrigin: '0 0 !important'}}>
						<div>hey</div>
						<div>what</div>
					</Transition.ReverseScale>
				</div>
				<Transition.ReverseScale style={{transformOrigin: '0 top !important'}}>Hello World</Transition.ReverseScale>
				<Transition.ReverseScale style={{position: 'absolute', right: 0, bottom: 0}}>
					There is a bunch of text
				</Transition.ReverseScale>
			</Transition>

			<div className={bool ? 'grid' : 'expanded'}>
				<Transition
					style={{ gridArea: 'a' }} className="box"
				>
					<Transition.PreserveAspectRatio style={{ color: 'blue' }}>
						{bool && <div>HELLO</div>}
			 			{!bool && <div>Quis blandit turpis cursus in hac habitasse platea dictumst. Quis eleifend quam adipiscing vitae proin sagittis nisl. Aliquet lectus proin nibh nisl. Interdum velit laoreet id donec ultrices tincidunt arcu non. Duis ut diam quam nulla porttitor massa id neque aliquam. Libero id faucibus nisl tincidunt eget nullam non nisi. Ut diam quam nulla porttitor massa id neque aliquam. Morbi non arcu risus quis varius quam quisque. Iaculis eu non diam phasellus vestibulum lorem sed. Congue mauris rhoncus aenean vel elit scelerisque mauris. Pulvinar elementum integer enim neque volutpat ac tincidunt vitae semper. Tincidunt id aliquet risus feugiat in ante metus. Vel quam elementum pulvinar etiam non quam lacus suspendisse. Dolor sit amet consectetur adipiscing elit duis. Pretium aenean pharetra magna ac. Imperdiet nulla malesuada pellentesque elit eget gravida.</div>}
					</Transition.PreserveAspectRatio>
				</Transition>

				<Transition
					className="box"
					style={{ gridArea: 'b' }}
				>
					<div>A</div>
					<Transition.ReverseScale style={{ color: 'red', fontSize: '8px' }}>
						B (BOBBLEWOBBLE!)
					</Transition.ReverseScale>
				</Transition>

				<Transition
					className="box"
					style={{ gridArea: 'c' }}
				>
					C
				</Transition>

				<Transition
					className="box"
					style={{ gridArea: 'd' }}
				>
					D
				</Transition>

				<Transition
					className="box"
					style={{ gridArea: 'e' }}
				>
					E
				</Transition>

				<Transition
					className="box"
					style={{ gridArea: 'f' }}
				>
					F
				</Transition>
			</div>
		</div>

	);
}

export default App;
