import { Component } from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';

export default class CountDown extends Component {
	constructor(props) {
		super(props);
		this.state = {
			realNow: DateTime.local(),
		};
		this.startCountdown();
	}

	componentDidMount() {
		const { refreshInterval } = this.props;
		this.timerId = setInterval(
			() => this.tick(),
			refreshInterval,
		);
	}

	componentWillUnmount() {
		clearInterval(this.timerId);
	}

	getTime() {
		const { realNow } = this.state;
		const { start } = this.props;
		return start.plus(realNow - this.realStart);
	}

	startCountdown() {
		this.realStart = DateTime.local();
	}

	durationLeft() {
		const { end, start } = this.props;
		const { realNow } = this.state;
		return (end.diff(start)).minus(realNow - this.realStart);
	}

	update() {
		this.setState({
			realNow: DateTime.local(),
		});
	}

	tick() {
		const { callback } = this.props;
		this.update();
		if (this.durationLeft() <= 0) {
			callback(this.getTime());
			this.startCountdown();
			this.update();
		}
	}

	render() {
		const d = this.durationLeft();
		const { children } = this.props;
		return children(d);
	}
}
CountDown.propTypes = {
	start: PropTypes.instanceOf(DateTime).isRequired,
	end: PropTypes.instanceOf(DateTime).isRequired,
	refreshInterval: PropTypes.number,
	callback: PropTypes.func,
	children: PropTypes.func,
};
CountDown.defaultProps = {
	callback: () => {},
	children: () => {},
	refreshInterval: 100,
};
