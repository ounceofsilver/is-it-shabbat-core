import React from 'react';
import { is } from 'shabbat-logic';

import ShabbatCheck from './ShabbatCheck';

const location = {
	coords: {
		latitude: 42,
		longitude: 73,
	},
};
const now = local();

describe('ShabbatCheck:', () => {
	it('should call child with period and duration', () => {
		const spy = sinon.stub().returns(<p>Hello</p>);
		const props = {
			now,
			location,
		};
		const wrapper = shallow(
			<ShabbatCheck {...props}>
				{spy}
			</ShabbatCheck>,
		);

		expect(spy).to.have.been.calledOnce();
		const [period, duration] = spy.args[0];
		expect(period).to.be.oneOf([is.SHABBAT, is.CANDLELIGHTING, is.NOT_SHABBAT]);
		expect(duration.isLuxonDateTime).to.be.true();

		// renders results of inner function
		expect(wrapper.html()).to.contain('Hello');
	});

	it('should not display if location is not given', () => {
		const props = {
			now,
			location: undefined,
		};
		const wrapper = shallow(
			<ShabbatCheck {...props} />,
		);
		expect(wrapper.find('ShabbatCheck').exists()).to.be.false();
	});

	it('should work if no children', () => {
		const props = {
			now,
			location,
		};
		const wrapper = shallow(
			<ShabbatCheck {...props} />,
		);

		// No children => nothing renders
		expect(wrapper.html()).to.be.null();
	});
});
