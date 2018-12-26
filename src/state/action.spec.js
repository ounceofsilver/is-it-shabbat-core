const mockStore = {
	dispatch: sinon.stub(),
	subscribe: sinon.stub(),
	getState: sinon.stub(),
};
const getHolidaysAsync = sinon.stub();
const mockSunset = sinon.stub();
const action = proxyquire('../src/state/action', {
	'../api/hebcal': {
		getHolidaysAsync,
	},
	'./store': {
		default: mockStore,
	},
	'shabbat-logic': {
		sunset: mockSunset,
	},
});

const TIME_NY = local(2018, 12, 25);
const COORDS_NY = { coords: { latitude: 42, longitude: -73 } };

// TODO(james.fulford): should I proxyquire and stub store?
describe('actions', () => {
	afterEach(() => {
		sinon.reset();
	});

	it('should subscribe functions and not dispatch on import', () => {
		expect(mockStore.subscribe).to.have.been.calledOnce();
		expect(mockStore.subscribe.args[0][0]).to.deep.equal(action.updateHolidays);

		expect(mockStore.dispatch).to.not.have.been.called();
	});

	describe('atomic actions', () => {
		describe('setNow', () => {
			it('should dispatch a SET_NOW action', () => {
				action.setNow(TIME_NY);
				expect(mockStore.dispatch).to.have.been.calledOnce();
				expect(mockStore.dispatch.args[0][0]).to.deep.equal({
					type: 'SET_NOW',
					now: TIME_NY,
				});
			});
		});

		describe('setLocation', () => {
			it('should dispatch a SET_LOCATION action', () => {
				action.setLocation(COORDS_NY);
				expect(mockStore.dispatch).to.have.been.calledOnce();
				expect(mockStore.dispatch.args[0][0]).to.deep.equal({
					type: 'SET_LOCATION',
					location: COORDS_NY,
				});
			});
		});

		describe('initialize', () => {
			it('should dispatch a SET_LOCATION action', () => {
				action.initialize(TIME_NY, COORDS_NY);
				expect(mockStore.dispatch).to.have.been.calledOnce();
				expect(mockStore.dispatch.args[0][0]).to.deep.equal({
					type: 'INITIALIZE',
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
					getHolidaysAsync.resolves([]);
				});

				it('should update if never updated before', () => {
					mockStore.getState.returns({
						now: local(2018, 12, 24),
						location: COORDS_NY,
						lastHolidayRequest: null, // never requested
					});

					action.updateHolidays();

					expect(getHolidaysAsync).to.have.been.calledOnce();
				});

				it('should update if forced', () => {
					mockStore.getState.returns({
						now: local(2018, 12, 24),
						lastHolidayRequest: local(2018, 12, 24),
						// recently requested, so should not request unless forced
						location: COORDS_NY,
					});

					action.updateHolidays(true);

					expect(getHolidaysAsync).to.have.been.calledOnce();
				});

				it('should update if not requested this month', () => {
					mockStore.getState.returns({
						now: local(2018, 12, 1),
						lastHolidayRequest: local(2018, 11, 31), // different month
						location: COORDS_NY,
					});

					action.updateHolidays();

					expect(getHolidaysAsync).to.have.been.calledOnce();
				});

				it('should update if requested this month last year', () => {
					mockStore.getState.returns({
						now: local(2018, 12, 1),
						lastHolidayRequest: local(2017, 12, 1), // different year
						location: COORDS_NY,
					});

					action.updateHolidays();

					expect(getHolidaysAsync).to.have.been.calledOnce();
				});

				it('should not update if updated this month and not forced', () => {
					mockStore.getState.returns({
						now: local(2018, 12, 2),
						lastHolidayRequest: local(2018, 12, 1),
						location: COORDS_NY,
					});

					action.updateHolidays();

					expect(getHolidaysAsync).to.not.have.been.calledOnce();
				});
			});

			describe('holiday transformations', () => {
				beforeEach(() => {
					mockStore.getState.returns({
						now: TIME_NY,
						location: COORDS_NY,
						lastHolidayRequest: null,
					});
				});

				it('should ignore past holidays', async () => {
					getHolidaysAsync.resolves([
						{ date: local(2018, 12, 24) },
						{ date: local(2018, 11, 31) },
					]);

					await action.updateHolidays(true);

					expect(mockStore.dispatch).to.have.been.calledOnce();
					expect(mockStore.dispatch.args[0][0]).to.deep.equal({
						type: 'SET_HOLIDAYS',
						holidays: [],
						now: TIME_NY,
					});
				});

				it('should adjust holiday dates to be at sunset', async () => {
					getHolidaysAsync.resolves([
						{ date: local(2018, 12, 25) },
						{ date: local(2019, 1, 2) },
					]);
					mockSunset.callsFake(d => d.set({ hours: 18 }));

					await action.updateHolidays(true);

					expect(mockStore.dispatch).to.have.been.calledOnce();
					expect(mockStore.dispatch.args[0][0]).to.deep.equal({
						type: 'SET_HOLIDAYS',
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
