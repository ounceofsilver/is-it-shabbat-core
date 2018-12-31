import React from 'react';
import CountDown from './CountDown';

describe('CountDown', () => {
	let clock;

	beforeEach(() => {
		clock = sinon.useFakeTimers();
	});

	afterEach(() => {
		clock.restore();
	});

	it('should call child function with remaining duration', () => {
		const childSpy = sinon.stub().returns(<p>Hello</p>);
		const cbSpy = sinon.stub();
		const props = {
			start: local(2018, 12, 24),
			end: local(2018, 12, 24, 0, 1),
			callback: cbSpy,
			refreshInterval: 5000,
		};
		const wrapper = shallow(
			<CountDown {...props}>
				{childSpy}
			</CountDown>,
		);

		// First cycle
		expect(childSpy).to.have.been.calledOnce();
		const fullLength = props.end.diff(props.start);
		let elapsedTime = fullLength.minus(childSpy.args[0][0]).shiftTo('milliseconds').milliseconds;
		expect(elapsedTime).to.be.at.most(1);

		// renders results of inner function
		expect(wrapper.html()).to.contain('Hello');

		// Next cycle
		clock.next();

		elapsedTime = fullLength.minus(childSpy.lastCall.args[0]).shiftTo('milliseconds').milliseconds;
		expect(elapsedTime).to.be.at.least(props.refreshInterval);
		expect(elapsedTime).to.be.at.most(props.refreshInterval + 1);

		// Just before last cycle
		clock.tick(fullLength.shiftTo('milliseconds').milliseconds - props.refreshInterval - 1);

		const remainingTime = childSpy.lastCall.args[0].shiftTo('milliseconds').milliseconds;
		expect(remainingTime).to.be.at.least(props.refreshInterval);
		expect(remainingTime).to.be.at.most(props.refreshInterval + 1);

		expect(cbSpy).to.not.have.been.called();

		// Last cycle has been triggered
		clock.tick(1);

		expect(cbSpy).to.have.been.calledOnce();

		wrapper.unmount();
	});

	it('should work with default callback and no children', () => {
		const props = {
			start: local(2018, 12, 24),
			end: local(2018, 12, 24, 0, 1),
			refreshInterval: 5000,
		};
		shallow(<CountDown {...props} />);
		clock.tick(60 * 1000); // Hitting default callback
	});
});
