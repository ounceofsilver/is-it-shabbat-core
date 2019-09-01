import { IHebcalOptions } from '../../../api/hebcal';
import { IHolidayOptions } from '../../../models/holidays';

export function getTime(): number {
	return new Date().getTime();
}

const onOff = (b: boolean): 'on' | 'off' => b ? 'on' : 'off';

export function mapOptions(options: IHolidayOptions): IHebcalOptions {
	return {
		maj: onOff(options.major),  // major holidays
		min: onOff(options.minor),  // minor holidays
		mod: onOff(options.modern),
		nx: onOff(options.roshChodeshim),
		ss: onOff(options.specialShabbatim),
		mf: onOff(options.fasts),
		i: onOff(options.hillel),  // Depends on location (Israel)
	};
}
