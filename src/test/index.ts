import { DateTime } from 'luxon';

export const local = (
	y: number,
	m: number,
	d: number,
	h: number = 0,
	min: number = 0,
	s: number = 0,
	ms: number = 0,
) => DateTime.fromObject({
	day: d,
	hour: h,
	millisecond: ms,
	minute: min,
	month: m,
	second: s,
	year: y,
	zone: 'America/New_York',
});
