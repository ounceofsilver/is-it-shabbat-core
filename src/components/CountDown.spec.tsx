import { Duration } from 'luxon';
import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { local } from '../test';
import { CountDown } from './CountDown';

describe('CountDown', () => {
	it('should render', () => {
		const childSpy = jest.fn().mockImplementation(
			(d: Duration) => <p>
				Hello
				{Math.floor(d.shiftTo('milliseconds').milliseconds / 1000)}
				s
			</p>,
		);
		const cbSpy = jest.fn();
		const props = {
			start: local(2018, 12, 24, 0, 1, 0),
			end: local(2018, 12, 24, 0, 1, 1),
			callback: cbSpy,
			refreshInterval: 500,
		};
		const wrapper = renderer.create(
			<CountDown {...props}>
				{childSpy}
			</CountDown>,
		);
		expect(wrapper.toJSON()).toMatchSnapshot();
	});

	it('should call child function with remaining duration', () => {
		jest.useFakeTimers();
		const childSpy = jest.fn().mockReturnValue(<p>Hello</p>);
		const cbSpy = jest.fn();
		const props = {
			start: local(2018, 12, 24, 0, 1, 0),
			end: local(2018, 12, 24, 0, 1, 1),
			callback: cbSpy,
			refreshInterval: 500,
		};
		renderer.create(
			<CountDown {...props}>
				{childSpy}
			</CountDown>,
		);

		// First cycle
		expect(childSpy).toHaveBeenCalled();
		childSpy.mockClear();

		// Next cycle
		jest.advanceTimersByTime(500);

		expect(childSpy).toHaveBeenCalled();
		expect(childSpy).toHaveBeenCalledWith(expect.any(Duration));
	});

	it('should work with default callback and no children', () => {
		jest.useFakeTimers();
		const props = {
			start: local(2018, 12, 24),
			end: local(2018, 12, 24, 0, 1),
			refreshInterval: 5000,
		};
		renderer.create(<CountDown {...props} />);
		jest.advanceTimersByTime(60 * 1000); // Hitting default callback
	});
});
