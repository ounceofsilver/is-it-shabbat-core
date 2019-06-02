import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { is } from 'shabbat-logic';

import { local } from '../test';
import { ShabbatCheck } from './ShabbatCheck';

const location = {
	coords: {
		latitude: 42,
		longitude: 73,
	},
};
const now = local();

describe('ShabbatCheck:', () => {
	it('should call child with period and duration', () => {
		const spy = jest.fn().mockReturnValue(<p>Hello</p>);
		const wrapper = renderer.create(
			<ShabbatCheck now={now} location={location}>
				{spy}
			</ShabbatCheck>,
		);

		expect(spy).toHaveBeenCalledTimes(1);
		const [period, duration] = spy.mock.calls[0];
		expect([is.SHABBAT, is.CANDLELIGHTING, is.NOT_SHABBAT]).toEqual(expect.arrayContaining([period]));
		expect(duration.isLuxonDateTime).toBe(true);

		// renders results of inner function
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
});
