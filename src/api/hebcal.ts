import axios from 'axios';
import { DateTime } from 'luxon';

const baseParams = {
	v: 1,
	cfg: 'json',

	// Candlelighting
	c: 'off',

	// hebdate: includes items with .memo giving hebrew date,
	// i.e. '1st of Kislev, 5779'. hebdate items are separate from holidays
	// hebdate for every holiday
	D: 'on',
	// hebdate for every hebrew day in the month
	d: 'off',
};

const defaultConfig = {
	// Holidays
	maj: 'on', // major holidays
	min: 'off', // minor holidays
	mod: 'off', // modern holidays
	nx: 'on', // rosh chodeshim
	ss: 'on', // special shabbats
	s: 'off', // parashat data
	mf: 'off', // minor fasts
	o: 'on', // days of omer

	// language
	lg: 'a', // ashkenazi pronouncement

	// Depends on location (Israel)
	i: 'off',
};

export const sendHolidayRequestAsync = (t, overrides) => axios({
	method: 'get',
	url: 'https://www.hebcal.com/hebcal/',
	params: {
		...defaultConfig,
		...overrides,
		// Depends on current time
		year: t.year,
		month: t.month,
		...baseParams,
	},
});

export const getHolidaysAsync = async (now, months, overrides = {}) => {
	if (months <= 0) {
		return [];
	}
	const monthArr = Array(months).fill(0).map((_, i) => i)
		.map(m => now.plus({ months: m }));
	const days = await Promise.all(
		monthArr
			.map(t => sendHolidayRequestAsync(t, overrides)),
	).then(resps => resps
		.map(response => response.data.items)
		.reduce((a, x) => a.concat(x)));
	// date to hebrew date string mapping
	const hebdates = new Map();
	days
		.filter(i => i.category === 'hebdate')
		.forEach((i) => {
			hebdates[i.date] = i.title;
		});

	// preparing holidays list
	const holidays = days
		.filter(i => i.category !== 'hebdate');

	return holidays.map((h) => {
		const [year, month, day] = h.date.split('-').map(Number);
		return ({
			...h,
			yomtov: Boolean(h.yomtov),
			hebdate: hebdates[h.date],
			date: DateTime.fromObject({
				year,
				month,
				day,
				hour: 0,
				minute: 0,
				second: 0,
				zone: now.zone,
			}).minus({ days: 1 }),
			// hebcal gregorian dates correspond
			// to the END of the hebrew day.
			// this code wants the BEGINNING of the hebrew day.
		});
	});
};
