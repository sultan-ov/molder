// import {} from './_api'
import { linkEvent, Component, version, render } from 'inferno'

class Clock extends Component {
	constructor() {
		super();
		// set initial time:
		this.state = {
			time: Date.now()
		};
	}

	componentDidMount() {
		// update time every second
		this.timer = setInterval(() => {
			this.setState({ time: Date.now() });
		}, 1000);
	}

	componentWillUnmount() {
		// stop when not renderable
		clearInterval(this.timer);
	}

	render() {
		let time = new Date(this.state.time).toLocaleTimeString();
		return (
			<span> <strong>Inferno version: </strong>{ version } <strong>Time: </strong>{ time }</span>
		);
	}
}

render(<Clock />, document.getElementById("root"));

// import PhotoSwipe from 'photoswipe';
// import PhotoSwipeUI_Default from 'photoswipe-ui';
