import { is } from 'shabbat-logic';

export default {
	translate: {
		status: {
			[is.SHABBAT]: 'Yes!',
			[is.NOT_SHABBAT]: 'No...',
			[is.CANDLELIGHTING]: 'Almost...',
		},
		endEventName: {
			[is.SHABBAT]: 'until Shabbat ends',
			[is.NOT_SHABBAT]: 'until candle lighting',
			[is.CANDLELIGHTING]: 'until Shabbat begins',
		},
	},
};
