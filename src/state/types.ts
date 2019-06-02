import { DateTime } from 'luxon';

export interface ILocation {
	coords: {
		latitude: number;
		longitude: number;
	};
}

export enum HolidayCategory {
	ROSHCHODESH = 'roshchodesh',
	HOLIDAY = 'holiday',
	OMER = 'omer',
}

export enum HolidaySubcat {
	MAJOR = 'major',
	MINOR = 'minor',
	SHABBAT = 'shabbat',
	MODERN = 'modern',
}

export interface IHoliday {
	title: string;
	date: DateTime;
	subcat: HolidaySubcat;
	category: HolidayCategory;
}

export interface IIsItShabbatState {
	now: DateTime;
	location: ILocation;
	holidays: IHoliday[];
	lastHolidayRequest: DateTime;
}

export enum ActionType {
	INITIALIZE,
	SET_LOCATION,
	SET_NOW,
	SET_HOLIDAYS,
	SETFAVCOLOR,
}

export interface IAction {
	type: ActionType;

	now?: DateTime;
	location?: ILocation;
	holidays?: IHoliday[];
}
