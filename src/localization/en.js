import { is } from 'shabbat-logic';

export default {
	translate: {
		copyright: '© 2019, James Fulford.',
		credit: 'Styles and Concept by Jessica Fulford',
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
		screens: {
			settings: 'Settings',
			info: 'Credits',
		},
	},
};
