import { DateTime } from 'luxon';
import React, { Component } from 'react';

declare const clearInterval;
declare const setInterval;

export class CountDown extends Component<{
	start: DateTime,
	end: DateTime,
	refreshInterval?: number,
	callback?: (now: DateTime) => void,
	children?: (now: DateTime) => JSX.Element,
}, {
	realNow: DateTime,
}> {
	private timerId?: number;
	private realStart?: DateTime;

	constructor(props) {
		super(props);
		this.state = {
			realNow: DateTime.local(),
		};
		this.startCountdown();
	}

	public componentDidMount = () => {
		this.timerId = setInterval(
			() => this.tick(),
			this.props.refreshInterval || 100,
		);
	}

	public render() {
		const d = this.durationLeft();
		const { children = () => null } = this.props;
		return children(d);
	}

	public componentWillUnmount() {
		clearInterval(this.timerId);
	}

	private getTime() {
		return this.props.start.plus(this.state.realNow - this.realStart);
	}

	private startCountdown() {
		this.realStart = DateTime.local();
	}

	private durationLeft() {
		const { end, start } = this.props;
		const { realNow } = this.state;
		return (end.diff(start)).minus(realNow - this.realStart);
	}

	private update() {
		this.setState({
			realNow: DateTime.local(),
		});
	}

	private tick() {
		const { callback } = this.props;
		this.update();
		if (this.durationLeft() <= 0) {
			if (this.props.callback) {
				this.props.callback(this.getTime());
			}
			this.startCountdown();
			this.update();
		}
	}
}
