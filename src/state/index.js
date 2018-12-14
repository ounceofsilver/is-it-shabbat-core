import { sunset } from 'shabbat-logic';
import { getHolidaysAsync } from '../api/hebcal';
import holidays from './HolidayState';
import spacetime from './SpaceTimeState';

export { holidays, spacetime };

//
// State synchronizations
//

export const updateHolidays = (force = false) => {
	// When location or time updates
	// and time is a different month or year,
	// update holidays list again
	const { now, location } = spacetime.user.getState();
	const { lastMonthRequested, lastYearRequested } = holidays.state.getState();

	if (force || (now.month !== lastMonthRequested || now.year !== lastYearRequested)) {
		// TODO: if config for Israel is "infer", infer here and pass in as override
		getHolidaysAsync(now, 2, {})
			.then(hs => holidays.action.setHolidays(
				hs.map(h => ({
					...h,
					date: sunset(h.date, location.coords.latitude, location.coords.longitude),
				})),
				now,
			));
	}
};
spacetime.user.subscribe(updateHolidays);
