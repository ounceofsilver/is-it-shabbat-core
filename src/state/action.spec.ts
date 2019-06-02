import { DateTime } from 'luxon';
import { local } from '../test';
import { ActionType, ILocation } from './types';

jest.mock('../api/hebcal');
jest.mock('./store');
jest.mock('shabbat-logic');
const mockStore = jest.requireMock('./store').default;
const { getHolidaysAsync } = jest.requireMock('../api/hebcal');
const { sunset } = jest.requireMock('shabbat-logic');

import { initialize, setLocation, setNow, updateHolidays } from './action';

const TIME_NY: DateTime = local(2018, 12, 25);
const COORDS_NY: ILocation = { coords: { latitude: 42, longitude: -73 } };

describe('actions', () => {
	// it('should subscribe functions and not dispatch on import', () => {
	// 	expect(mockStore.subscribe).to.have.been.calledOnce();
	// 	expect(mockStore.subscribe.args[0][0]).to.deep.equal(updateHolidays);
	//
	// 	expect(mockStore.dispatch).to.not.have.been.called();
	// });

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('atomic actions', () => {
		describe('setNow', () => {
			it('should dispatch a SET_NOW action', () => {
				const act = setNow(TIME_NY);
				expect(act).toEqual({
					type: ActionType.SET_NOW,
					now: TIME_NY,
				});
			});
		});

		describe('setLocation', () => {
			it('should dispatch a SET_LOCATION action', () => {
				const act = setLocation(COORDS_NY);
				expect(act).toEqual({
					type: ActionType.SET_LOCATION,
					location: COORDS_NY,
				});
			});
		});

		describe('initialize', () => {
			it('should dispatch a SET_LOCATION action', () => {
				const act = initialize(TIME_NY, COORDS_NY);
				expect(act).toEqual({
					type: ActionType.INITIALIZE,
					location: COORDS_NY,
					now: TIME_NY,
				});
			});
		});
	});
	describe('advanced actions', () => {
		//
		// This takes the place of setHolidays and introduces the API
		//
		describe('updateHolidays', () => {
			describe('update avoidance mechanism', () => {
				beforeEach(() => {
					getHolidaysAsync.mockResolvedValue([]);
				});

				it('should update if never updated before', () => {
					mockStore.getState.mockReturnValue({
						now: local(2018, 12, 24),
						location: COORDS_NY,
						lastHolidayRequest: null, // never requested
					});

					updateHolidays();

					expect(getHolidaysAsync).toHaveBeenCalledTimes(1);
				});

				it('should update if forced', () => {
					mockStore.getState.mockReturnValue({
						now: local(2018, 12, 24),
						lastHolidayRequest: local(2018, 12, 24),
						// recently requested, so should not request unless forced
						location: COORDS_NY,
					});

					updateHolidays(true);

					expect(getHolidaysAsync).toHaveBeenCalledTimes(1);
				});

				it('should update if not requested this month', () => {
					mockStore.getState.mockReturnValue({
						now: local(2018, 12, 1),
						lastHolidayRequest: local(2018, 11, 31), // different month
						location: COORDS_NY,
					});

					updateHolidays();

					expect(getHolidaysAsync).toHaveBeenCalledTimes(1);
				});

				it('should update if requested this month last year', () => {
					mockStore.getState.mockReturnValue({
						now: local(2018, 12, 1),
						lastHolidayRequest: local(2017, 12, 1), // different year
						location: COORDS_NY,
					});

					updateHolidays();

					expect(getHolidaysAsync).toHaveBeenCalledTimes(1);
				});

				it('should not update if updated this month and not forced', () => {
					mockStore.getState.mockReturnValue({
						now: local(2018, 12, 2),
						lastHolidayRequest: local(2018, 12, 1),
						location: COORDS_NY,
					});

					updateHolidays();

					expect(getHolidaysAsync).not.toHaveBeenCalled();
				});
			});

			describe('holiday transformations', () => {
				beforeEach(() => {
					mockStore.getState.mockReturnValue({
						now: TIME_NY,
						location: COORDS_NY,
						lastHolidayRequest: null,
					});
				});

				it('should adjust holiday dates to be at sunset', async () => {
					getHolidaysAsync.mockResolvedValue([
						{ date: local(2018, 12, 25) },
						{ date: local(2019, 1, 2) },
					]);
					sunset.mockImplementation(d => d.set({ hours: 18 }));

					await updateHolidays(true);

					expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
					expect(mockStore.dispatch.mock.calls[0][0]).toEqual({
						type: ActionType.SET_HOLIDAYS,
						holidays: [
							{ date: local(2018, 12, 25, 18) },
							{ date: local(2019, 1, 2, 18) },
						],
						now: TIME_NY,
					});
				});
			});
		});
	});
});
