import { is } from 'shabbat-logic';

export const en_US = {
	isItShabbat: {
		status: {
			[is.SHABBAT]: 'Yes!',
			[is.NOT_SHABBAT]: 'No...',
			[is.CANDLELIGHTING]: 'Almost...',
		},
		endEventName: {
			[is.SHABBAT]: 'Shabbat ends',
			[is.NOT_SHABBAT]: 'candle lighting',
			[is.CANDLELIGHTING]: 'Shabbat begins',
		},
	},
};
