import { DateTime } from 'luxon';

import { local } from '../test';
import { defaultState, reducer } from './store';
import { ActionType, IHoliday, IIsItShabbatState } from './types';

const COORDS_GMT = { coords: { latitude: 0, longitude: 0 } };
const TIME_GMT = DateTime.fromObject({
	year: 2018,
	month: 12,
	day: 25,
	hours: 5,
	zone: 'Etc/GMT',
});

const COORDS_NY = { coords: { latitude: 42, longitude: -73 } };
const TIME_NY = local(2018, 12, 25);

const INITIALIZED_STATE: IIsItShabbatState = {
	now: TIME_GMT,
	location: COORDS_GMT,
	holidays: [0, 1, 2] as unknown as IHoliday[],
	lastHolidayRequest: TIME_GMT,
};

describe('reducer', () => {
	it('should set state on initialization', () => {
		const finalState = reducer(defaultState, {
			type: ActionType.INITIALIZE,
			location: COORDS_GMT,
			now: TIME_NY, // zone is America/New_York
		});

		expect(finalState).toEqual({
			...defaultState,
			location: COORDS_GMT,
			now: TIME_GMT,
		});
	});

	it('should set location and adjust current timezone', () => {
		const finalState = reducer(INITIALIZED_STATE, {
			type: ActionType.SET_LOCATION,
			location: COORDS_NY,
		});

		expect(finalState).toEqual({
			...INITIALIZED_STATE,
			now: TIME_NY,
			location: COORDS_NY,
		});
	});

	it('should set now and preserve current timezone', () => {
		const finalState = reducer(INITIALIZED_STATE, {
			type: ActionType.SET_NOW,
			now: TIME_NY.plus({ hours: 2 }),
		});

		expect(finalState).toEqual({
			...INITIALIZED_STATE,
			now: TIME_GMT.plus({ hours: 2 }),
		});
	});

	it('should set holidays', () => {
		const finalState = reducer(INITIALIZED_STATE, {
			type: ActionType.SET_HOLIDAYS,
			holidays: [4, 5, 6] as unknown as IHoliday[],
			now: TIME_NY.plus({ minutes: 2 }),
		});

		expect(finalState).toEqual({
			...INITIALIZED_STATE,
			holidays: [4, 5, 6],
			lastHolidayRequest: TIME_NY.plus({ minutes: 2 }),
		});
	});
});
