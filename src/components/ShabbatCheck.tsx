import { DateTime } from 'luxon';
import React from 'react';
import { is, isItShabbat } from 'shabbat-logic';

import { ILocation } from '../state/types';

interface IShabbatCheckProps {
	now: DateTime;
	location: ILocation;
	children: (period: is, countDownTo: DateTime) => JSX.Element;
}

export const ShabbatCheck: React.SFC<IShabbatCheckProps> = ({
	now,
	location,
	children,
}) => {
	if (!location) {
		return null;
	}
	const { coords: { latitude, longitude } } = location;
	const { period, countDownTo } = isItShabbat(now, latitude, longitude);

	return children(period, countDownTo);
};
