import React from 'react';
import _ from 'underscore';
import RequestManager from './RequestManager';

/**
 * Display all stats from game
 */
class SimulationWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            save_name: '',
            current_simulation: {},
            saved_simulations: [],
            selected_id: -1,
            simulation_loaded: false
        };

        this.request_manager = new RequestManager();

        this.updateSaveName = this.updateSaveName.bind(this);
        this.simulationButtonPressed = this.simulationButtonPressed.bind(this);
        this.resetAllButtonPressed = this.resetAllButtonPressed.bind(this);
        this.saveButtonPressed = this.saveButtonPressed.bind(this);
        this.loadGameButtonPressed = this.loadGameButtonPressed.bind(this);
        this.setSimulation = this.setSimulation.bind(this);
        this.onSimulationRecieved = this.onSimulationRecieved.bind(this);
        this.storeSavedSimulations = this.storeSavedSimulations.bind(this);
        this.savedSimSelected = this.savedSimSelected.bind(this);
        this.loadSavedSimulations = this.loadSavedSimulations.bind(this);
        this.deleteSavedSimulation = this.deleteSavedSimulation.bind(this);

        this.loadSavedSimulations();

    }

    setSimulation(sim_data) {
        this.setState({
            current_simulation: sim_data
        });
    }

    onSimulationRecieved(sim_data) {
        this.setSimulation(sim_data);
        this.props.sim_callback(sim_data, true);
    }

    simulationButtonPressed() {
        const endpoint_base = "get_simulation/";
        let away_string = "away=" + this.props.away_id.toString();
        let home_string = "home=" + this.props.home_id.toString();
        let url = endpoint_base + away_string + "&" + home_string;
        this.request_manager.fetchData(url, this.onSimulationRecieved, false);
    }

    resetAllButtonPressed() {
        this.props.sim_callback({}, false);
        this.setState({
            save_name: '',
            current_simulation: {},
            selected_id: -1,
            simulation_loaded: false
        });
        this.loadSavedSimulations();
    }

    static sameNameCallback(response) {
        console.log(response);
        alert("There is already a simulation with this name. Please choose a new one.");
    }

    saveButtonPressed() {
        const save_endpoint = 'savesimulation';

        if (this.state.current_simulation.hasOwnProperty('away')) {
            let invalid = /[^a-zA-Z0-9]/.test(this.state.save_name) || this.state.save_name.length === 0;
            if (!invalid) {
                let data = {
                    save_name: this.state.save_name,
                    box_score: this.state.current_simulation,
                    away_tm_id: this.props.away_id,
                    home_tm_id: this.props.home_id
                };

                this.request_manager.postData(save_endpoint, data, this.loadSavedSimulations, this.sameNameCallback);
            } else {
                alert('Save name must be non-empty and alphanumeric characters only');
            }
        } else {
            alert('There is no simulation to save!')
        }
    }

    storeSavedSimulations(sim_list) {
        this.setState({
            saved_simulations: sim_list
        });
    }

    loadSavedSimulations() {
        const endpoint = 'get_saved_simulations';
        this.request_manager.fetchData(endpoint, this.storeSavedSimulations, false);
    }

    deleteSavedSimulation(event, sim_id) {
        const endpoint = 'delete_saved_simulation=';
        let url = endpoint + sim_id.toString();
        this.request_manager.deleteItem(url, this.loadSavedSimulations);
    }

    loadGameButtonPressed() {

    }

    updateSaveName(evt) {
        this.setState({
            save_name: evt.target.value
        });
    }

    savedSimSelected(event, id) {
        this.setState({
            selected_id: id
        });
    }

    populateListItems(sim_list) {
        const x_url = 'http://www.clipartkid.com/images/92/icon-clip-art-at-clker-com-vector-clip-art-online-royalty-free-ti7tPm-clipart.png';
        const base_li_style = {
            borderBottom: '1px solid #aaaaaa',
            cursor: 'pointer'
        };
        const main_div_style = {
            display: 'inline-block',
            width: '45%',
            textAlign: 'left'
        };
        const last_div_style = {
            display: 'inline-block',
            float: 'right',
            width: '5%',
            margin: '1px'
        };

        const selected_style = Object.assign({}, base_li_style, {backgroundColor: '#16bfdd'});

        return sim_list.map((sim) => (
            <li key={sim['simulation_id']} style={this.state.selected_id === sim['simulation_id'] ? selected_style : base_li_style} onClick={_.partial(this.savedSimSelected, _, sim['simulation_id'])}>
                <div style={main_div_style}>
                    {sim['save_name']}
                </div>
                <div style={main_div_style}>
                    {sim['timestamp']}
                </div>
                <div style={last_div_style} onClick={_.partial(this.deleteSavedSimulation, _, sim['simulation_id'])}>
                    <img src={x_url} height="12px" width="12px" />
                </div>
            </li>
        ));
    }

    render() {
        const outer_style = {
            width: 'calc(50% - 10px)',
            height: 'calc(100% - 10px)',
            background: 'white',
            display: 'inline-block',
            margin: '5px 4px',
            border: '1px solid black',
            borderRadius: '5px',
            float: 'right'
        };

        const button_style = {
            width: '65%',
            background: '#bbbbbb',
            margin: '10px auto',
            clear: 'both',
            height: '15%',
            textAlign: 'center',
            border: '5px gray inset',
            cursor: 'pointer',
            overflow: 'hidden'
        };

        const save_div_style = {
            width: '100%',
            borderTop: '1px solid black',
            borderBottom: '1px solid black',
            height: '15%'
        };

        const title_style = {
            textAlign: 'center',
            clear: 'both',
            margin: '2px',
            fontWeight: 'bold'
        };

        const save_button_style = {
            float: 'right',
            height: '1em',
            margin: '0px 10px',
            padding: '0px 2px',
            textAlign: 'center',
            border: '3px inset gray',
            backgroundColor: '#AAAAAA',
            cursor: 'pointer'
        };

        const ul_style = {
            margin: 'auto',
            width: '80%',
            height: '40%',
            listStyleType: 'none',
            border: '1px solid black',
            overflow: 'scroll',
            padding: '0px'
        };

        const bottom_button_style = {
            textAlign: 'center',
            backgroundColor: '#AAAAAA',
            border: '3px inset gray',
            width: '60%',
            margin: '10px auto',
            cursor: 'pointer'
        };

        return (
            <div style={outer_style}>
                <div style={button_style} onClick={this.simulationButtonPressed}>
                    <h2 style={{margin: '10px'}}>Simulate this game!</h2>
                </div>
                <div style={save_div_style}>
                    <p style={title_style}>Save your simulation</p>
                    <div style={save_button_style} onClick={this.saveButtonPressed}>
                        Save!
                    </div>
                    <div style={{float: 'left', width: '20%', margin: 'auto', textAlign: 'center'}}>
                        Name:
                    </div>
                    <div>
                        <input size={30} maxLength={45} value={this.state.save_name} onChange={this.updateSaveName}/>
                    </div>

                </div>
                <div>
                    <p style={title_style}>Load a saved simulation</p>
                    <div>
                        <ul style={ul_style}>
                            {this.populateListItems(this.state.saved_simulations)}
                        </ul>
                    </div>
                </div>
                <div style={{bottom: '0px', width: '50%', display: 'inline-block'}}>
                    <div style={bottom_button_style} onClick={this.resetAllButtonPressed}>
                        Reset all
                    </div>
                </div>
                <div style={{height: 'auto', width: '50%', display: 'inline-block'}}>
                    <div style={bottom_button_style} onClick={this.loadGameButtonPressed}>
                        Load game
                    </div>
                </div>
            </div>
        );
    }
}

export default SimulationWindow;