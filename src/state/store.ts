import { DateTime } from 'luxon';
import { createStore } from 'redux';
import * as lookup from 'tz-lookup';

import { ActionType, IAction, IHoliday, IIsItShabbatState, ILocation } from './types';

const convertNow = (now: DateTime, location: ILocation): { now: DateTime } => ({
	now: now.setZone(
		lookup(location.coords.latitude, location.coords.longitude),
	),
});

export const defaultState: IIsItShabbatState = {
	// Location and timezone must match
	now: DateTime.local(),
	// coords.latitude, coords.longitude must exist
	location: null,

	holidays: [],
	// This DateTime does not have to care about location
	lastHolidayRequest: null,
};

export const reducer = (state: IIsItShabbatState = defaultState, action: IAction) => {
	//
	// Initialization
	//
	if (action.type === ActionType.INITIALIZE) {
		const { now, location } = action as { now: DateTime, location: ILocation };
		const newNow = convertNow(now, location).now;
		return {
			...state,
			location,
			now: newNow,
		};
	}

	//
	// State changes
	//
	if (action.type === ActionType.SET_LOCATION) {
		const { location } = action as { location: ILocation };
		return {
			...state,
			...convertNow(state.now, location),
			location,
		};
	}
	if (action.type === ActionType.SET_NOW) {
		const { now } = action as { now: DateTime };
		return {
			...state,
			...convertNow(now, state.location),
		};
	}
	if (action.type === ActionType.SET_HOLIDAYS) {
		const { holidays, now } = action as { holidays: IHoliday[], now: DateTime };
		return {
			...state,
			holidays,
			lastHolidayRequest: now,
		};
	}

	return state;
};

export default createStore(reducer);
