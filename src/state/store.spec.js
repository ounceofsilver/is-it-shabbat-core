import {
	reducer,
	defaultState,
} from './store';

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


const INITIALIZED_STATE = {
	now: TIME_GMT,
	location: COORDS_GMT,
	holidays: [0, 1, 2],
	lastHolidayRequest: TIME_GMT,
};

describe('reducer', () => {
	it('should set state on initialization', () => {
		const finalState = reducer(defaultState, {
			type: 'INITIALIZE',
			location: COORDS_GMT,
			now: TIME_NY, // zone is America/New_York
		});

		expect(finalState).to.deep.equal({
			...defaultState,
			location: COORDS_GMT,
			now: TIME_GMT,
		});
	});

	it('should set location and adjust current timezone', () => {
		const finalState = reducer(INITIALIZED_STATE, {
			type: 'SET_LOCATION',
			location: COORDS_NY,
		});

		expect(finalState).to.deep.equal({
			...INITIALIZED_STATE,
			now: TIME_NY,
			location: COORDS_NY,
		});
	});

	it('should set now and preserve current timezone', () => {
		const finalState = reducer(INITIALIZED_STATE, {
			type: 'SET_NOW',
			now: TIME_NY.plus({ hours: 2 }),
		});

		expect(finalState).to.deep.equal({
			...INITIALIZED_STATE,
			now: TIME_GMT.plus({ hours: 2 }),
		});
	});

	it('should set holidays', () => {
		const finalState = reducer(INITIALIZED_STATE, {
			type: 'SET_HOLIDAYS',
			holidays: [4, 5, 6],
			now: TIME_NY.plus({ minutes: 2 }),
		});

		expect(finalState).to.deep.equal({
			...INITIALIZED_STATE,
			holidays: [4, 5, 6],
			lastHolidayRequest: TIME_NY.plus({ minutes: 2 }),
		});
	});
});
