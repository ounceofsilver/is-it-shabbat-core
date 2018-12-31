import 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';

import { isItShabbat } from 'shabbat-logic';

export default function ShabbatCheck(props) {
	const { now, location, children } = props;
	if (!location) {
		return null;
	}
	const { coords: { latitude, longitude } } = location;
	const { period, countDownTo } = isItShabbat(now, latitude, longitude);
	return children(period, countDownTo);
}
ShabbatCheck.propTypes = {
	now: PropTypes.instanceOf(DateTime).isRequired,
	location: PropTypes.shape({
		coords: PropTypes.shape({
			latitude: PropTypes.number,
			longitude: PropTypes.number,
		}),
	}).isRequired,
	children: PropTypes.func,
};

ShabbatCheck.defaultProps = {
	children: () => {},
};
