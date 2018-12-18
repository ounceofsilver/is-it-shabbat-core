import {
	createStore,
} from 'redux';
import { DateTime } from 'luxon';

import lookup from 'tz-lookup';

const defaultState = {
	location: null,
	now: DateTime.local(),
};
const userState = createStore((state = defaultState, action) => {
	if (action.type === 'SET_LOCATION') {
		const zone = lookup(action.location.coords.latitude, action.location.coords.longitude);
		return Object.assign({}, state, { location: action.location, now: state.now.setZone(zone) });
	}
	if (action.type === 'SET_NOW') {
		const zone = lookup(state.location.coords.latitude, state.location.coords.longitude);
		return Object.assign({}, state, { now: action.now.setZone(zone) });
	}
	if (action.type === 'INITIALIZE') {
		const zone = lookup(action.location.coords.latitude, action.location.coords.longitude);
		return Object.assign({}, state, { now: action.now.setZone(zone), location: action.location });
	}
	return state;
});
module.exports = {
	user: userState,
	action: {
		setNow: (now) => {
			userState.dispatch({
				type: 'SET_NOW',
				now,
			});
		},
		setLocation: (location) => {
			userState.dispatch({
				type: 'SET_LOCATION',
				location,
			});
		},
		initialize: (now, location) => {
			userState.dispatch({
				type: 'INITIALIZE',
				now,
				location,
			});
		},
	},
};