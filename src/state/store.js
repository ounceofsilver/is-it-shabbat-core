import {
	createStore,
} from 'redux';
import { DateTime } from 'luxon';
import lookup from 'tz-lookup';


const convertNow = (now, location) => ({
	now: now.setZone(
		lookup(location.coords.latitude, location.coords.longitude),
	),
});

export const defaultState = {
	// Location and timezone must match
	now: DateTime.local(),
	// coords.latitude, coords.longitude must exist
	location: null,

	holidays: [],
	// This DateTime does not have to care about location
	lastHolidayRequest: null,
};
export const reducer = (state = defaultState, action) => {
	//
	// Initialization
	//
	if (action.type === 'INITIALIZE') {
		const { now } = convertNow(action.now, action.location);
		return {
			...state,
			location: action.location,
			now,
		};
	}

	//
	// State changes
	//
	if (action.type === 'SET_LOCATION') {
		return {
			...state,
			...convertNow(state.now, action.location),
			location: action.location,
		};
	}
	if (action.type === 'SET_NOW') {
		return {
			...state,
			...convertNow(action.now, state.location),
		};
	}
	if (action.type === 'SET_HOLIDAYS') {
		return {
			...state,
			holidays: action.holidays,
			lastHolidayRequest: action.now,
		};
	}

	return state;
};

export default createStore(reducer);
