import { DateTime } from 'luxon';
import { is, isItShabbat as _isItShabbat } from 'shabbat-logic';
import * as lookup from 'tz-lookup';

import { ILocation } from '../../models/config';
import { AppState } from '../use';

export function location(state: AppState): ILocation | undefined {
	return state.config.location;
}

export function timezone(state: AppState): string | undefined {
	const currentLocation = location(state);
	if (!currentLocation) { return; }
	return lookup(currentLocation.coords.latitude, currentLocation.coords.longitude);
}

export function now(state: AppState): DateTime | undefined {
	const currentTimezone = timezone(state);
	if (!currentTimezone) { return; }
	return DateTime.local().setZone(currentTimezone);
}

export function isItShabbat(state: AppState): { period: is, countDownTo: DateTime } {
	const currentLocation = location(state);
	const rightNow = now(state);
	if (!currentLocation || !rightNow) { return; }
	return _isItShabbat(rightNow, currentLocation.coords.latitude, currentLocation.coords.longitude);
}
