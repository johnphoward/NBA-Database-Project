import React from 'react';
import SimulationWindow from './SimulationWindow';
import BoxStats from './BoxStats';

/**
 * Display all stats from game
 */
class BoxWrapper extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            game_data: this.props.data,
            simulation_data: {},
            showing_sim: false
        };

        this.setSimulationState = this.setSimulationState.bind(this);
    }

    setSimulationState(simulation_data, set_showing=false) {
        this.setState({
            simulation_data: simulation_data,
            showing_sim: set_showing
        });
    }

    componentWillReceiveProps() {
        this.setSimulationState({}, false);
    }

    render() {
        const outer_style = {
            width: 'calc(100% - 10px)',
            height: 'calc(60% - 10px)',
            background: '#555555',
            display: 'inline-block',
            margin: '5px',
            padding: '0px',
            border: '1px solid black',
            borderRadius: '5px',

        };

        let real_data = (Object.keys(this.props.data).length > 0 && this.props.data['box_score'].hasOwnProperty('away'));

        let data = {};
        if (this.state.showing_sim) {
            data = this.state.simulation_data;
        } else if (real_data) {
            data = this.props.data['box_score'];
        }
        let away = this.props.data.hasOwnProperty('away') ? this.props.data['away'] : 'GSW';
        let home = this.props.data.hasOwnProperty('home') ? this.props.data['home'] : 'OKC';

        let away_id = this.props.data.hasOwnProperty('stats') ? this.props.data['stats']['away']['stat_id'] : 'test';
        let home_id = this.props.data.hasOwnProperty('stats') ? this.props.data['stats']['home']['stat_id'] : 'test';

        return (
            <div style={outer_style}>
                <BoxStats away={away} home={home} data={data} simulation={this.state.showing_sim}/>
                <SimulationWindow away_id={away_id} home_id={home_id} sim_callback={this.setSimulationState}/>
            </div>

        );
    }
}

export default BoxWrapper;