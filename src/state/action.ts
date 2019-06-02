import { DateTime } from 'luxon';
import { sunset } from 'shabbat-logic';

import { getHolidaysAsync } from '../api/hebcal';
import store from './store';
import { ActionType, IAction, IHoliday, ILocation } from './types';

//
// Atomic actions
//
// Do not export; force use of updateHolidays
export const setNow = (now: DateTime): IAction => ({
	now,
	type: ActionType.SET_NOW,
});

const setHolidays = (holidays: IHoliday[], now: DateTime): IAction => ({
	holidays,
	now,
	type: ActionType.SET_HOLIDAYS,
});

export const setLocation = (location: ILocation): IAction => ({
	location,
	type: ActionType.SET_LOCATION,
});

export const initialize = (now: DateTime, location: ILocation): IAction => ({
	now,
	location,
	type: ActionType.INITIALIZE,
});

//
// Advanced actions
//
export const updateHolidays = (force: boolean = false): Promise<any> => {
	// When location or time updates
	// and time is a different month or year,
	// update holidays list again
	const {
		now,
		location,
		lastHolidayRequest,
	} = store.getState();

	if (
		// update if forced
		force
		// update if never updated before
		|| !lastHolidayRequest
		// update if its a new month and/or year
		|| (now.month !== lastHolidayRequest.month || now.year !== lastHolidayRequest.year)
	) {
		// TODO(james.fulford): if config for Israel is "infer", infer here and pass in as override
		return getHolidaysAsync(now, 2, {})
			.then(hs => store.dispatch(setHolidays(
				hs
					.map(h => ({
						...h,
						date: sunset(h.date, location.coords.latitude, location.coords.longitude),
					})),
				now,
			)));
	}
	return Promise.resolve(false);
};
store.subscribe(updateHolidays);
