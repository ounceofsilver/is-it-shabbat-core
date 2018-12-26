import { sunset } from 'shabbat-logic';
import { getHolidaysAsync } from '../api/hebcal';
import store from './store';

//
// Atomic actions
//
// Do not export; forse use of updateHolidays
export const setNow = (now) => {
	store.dispatch({
		type: 'SET_NOW',
		now,
	});
};

const setHolidays = (holidays, now) => {
	store.dispatch({
		type: 'SET_HOLIDAYS',
		holidays,
		now,
	});
};

export const setLocation = (location) => {
	store.dispatch({
		type: 'SET_LOCATION',
		location,
	});
};

export const initialize = (now, location) => {
	store.dispatch({
		type: 'INITIALIZE',
		now,
		location,
	});
};

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
			.then(hs => setHolidays(
				hs
					.map(h => ({
						...h,
						date: sunset(h.date, location.coords.latitude, location.coords.longitude),
					}))
					.filter(h => h.date > now),
				now,
			));
	}
	return Promise.resolve(false);
};
store.subscribe(updateHolidays);
