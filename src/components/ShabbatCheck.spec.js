import React from 'react';
import { is } from 'shabbat-logic';

import ShabbatCheck from './ShabbatCheck';

describe('ShabbatCheck:', () => {
	it('should call child with period and duration', () => {
		const spy = sinon.stub();
		const props = {
			now: local(),
			location: {
				coords: {
					latitude: 42,
					longitude: 73,
				},
			},
		};
		shallow(
			<ShabbatCheck {...props}>
				{spy}
			</ShabbatCheck>,
		);

		expect(spy).to.have.been.calledOnce();
		const [period, duration] = spy.args[0];
		expect(period).to.be.oneOf([is.SHABBAT, is.CANDLELIGHTING, is.NOT_SHABBAT]);
		expect(duration.isLuxonDateTime).to.be.true();
	});
});
