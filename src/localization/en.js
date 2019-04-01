import { is } from 'shabbat-logic';

export default {
	translate: {
		title: 'Is It Shabbat?',
		copyright: '© 2018-2019\nAn Ounce of Silver Technologies',
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
		startEventName: {
			[is.SHABBAT]: 'Shabbat ends',
			[is.NOT_SHABBAT]: 'Candle Lighting',
			[is.CANDLELIGHTING]: 'Shabbat begins',
		},
		screens: {
			settings: 'Settings',
		},
		settings: {
			location: {
				useCurrentLocation: 'Use Current Location',
			},
		},
	},
};
