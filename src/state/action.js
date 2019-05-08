import { sunset } from 'shabbat-logic';
import { getHolidaysAsync } from '../api/hebcal';
import store from './store';

//
// Atomic actions
//
// Do not export; forse use of updateHolidays
export const setNow = now => ({
	type: 'SET_NOW',
	now,
});

const setHolidays = (holidays, now) => ({
	type: 'SET_HOLIDAYS',
	holidays,
	now,
});

export const setLocation = location => ({
	type: 'SET_LOCATION',
	location,
});

export const initialize = (now, location) => ({
	type: 'INITIALIZE',
	now,
	location,
});

//
// Advanced actions
//
export const updateHolidays = (force = false) => {
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
