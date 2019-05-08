const axios = sinon.stub();
const {
	sendHolidayRequestAsync,
	getHolidaysAsync,
} = proxyquire('../src/api/hebcal', {
	axios,
});

const mockResponse = {
	data: {
		items: [
			{
				category: 'holiday',
				date: '2015-05-23',
				title: 'HOLIDAY',
			}, {
				category: 'hebdate',
				date: '2015-05-23',
				title: 'HEBREW_DATE',
			},
		],
	},
};

const expectedHoliday = {
	...mockResponse.data.items[0],
	date: local(2015, 5, 22),
	hebdate: mockResponse.data.items[1].title,
	yomtov: false,
};

describe('hebcal', () => {
	beforeEach(() => {
		axios.resolves(mockResponse);
	});

	afterEach(() => {
		sinon.resetHistory();
	});

	describe('sendHolidayRequestAsync', () => {
		it('should make API calls correctly', async () => {
			await sendHolidayRequestAsync(
				local(2018, 11, 1),
				{},
			);
			expect(axios).to.have.been.calledOnce();
			expect(axios.args[0][0]).to.deep.include({
				method: 'get',
				url: 'https://www.hebcal.com/hebcal/',
			});
			expect(axios.args[0][0].params).to.deep.include({
				year: 2018,
				month: 11,

				// Critical defaults
				D: 'on',
				maj: 'on',

				i: 'off', // (so we know override test works)
			});
		});

		it('should allow API setting overrides', async () => {
			await sendHolidayRequestAsync(
				local(2018, 11, 1),
				{ i: 'on' },
			);
			expect(axios.args[0][0].params).to.deep.include({
				i: 'on',
			});
		});
	});

	describe('getHolidaysAsync', () => {
		it('should return empty if 0 months', async () => {
			const holidays = await getHolidaysAsync(
				local(2018, 11, 1),
				0,
			);
			expect(holidays).to.deep.equal([]);
		});

		it('should collate holidays and hebdates', async () => {
			const holidays = await getHolidaysAsync(
				local(2018, 11, 1),
				1,
			);
			expect(holidays).to.deep.equal([
				expectedHoliday,
			]);
		});

		it('should collect holidays over multiple months/API calls', async () => {
			const holidays = await getHolidaysAsync(
				local(2018, 11, 1),
				3,
			);
			expect(axios).to.have.been.calledThrice();
			expect(axios.args[0][0].params).to.deep.include({
				year: 2018,
				month: 11,
			});
			expect(axios.args[1][0].params).to.deep.include({
				year: 2018,
				month: 12,
			});
			expect(axios.args[2][0].params).to.deep.include({
				year: 2019,
				month: 1,
			});
			expect(holidays).to.deep.equal([
				expectedHoliday,
				expectedHoliday,
				expectedHoliday,
			]);
		});
	});
});
