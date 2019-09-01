import { combineReducers } from 'redux';

import config from './config';
import holiday from './holiday';

const rootReducer = combineReducers({
	holiday,
	config,
});

export default rootReducer;
export type AppState = ReturnType<typeof rootReducer>;
