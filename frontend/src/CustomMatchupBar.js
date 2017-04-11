import React from 'react';
import _ from 'underscore';
import RequestManager from './RequestManager';
import YearBar from './YearBar';
import InlineButton from './InlineButton';
import UIUtilities from './UIUtilities';

class CustomMatchupBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            awayID: -1,
            awayString: 'No team selected',
            homeID: -1,
            homeString: 'No team selected',
            selectingAway: true,
            year: 2017,
            currentGameNumber: 1,
            teamsForYear: [],
            teamSelected: null,
            selectedTeamGames: [],
            requestManager: new RequestManager()
        };

        this.setSelectingAway = this.setSelectingAway.bind(this);
        this.setTeamList = this.setTeamList.bind(this);
        this.getTeamsForSeason = this.getTeamsForSeason.bind(this);
        this.setYear = this.setYear.bind(this);
        this.setTeamSelected = this.setTeamSelected.bind(this);
        this.setSelectedTeamGames = this.setSelectedTeamGames.bind(this);
        this.updateGameNumber = this.updateGameNumber.bind(this);
        this.selectButtonPressed = this.selectButtonPressed.bind(this);
        this.goButtonPressed = this.goButtonPressed.bind(this);

        this.getTeamsForSeason(this.state.year);
    }

    goButtonPressed() {
        if (this.state.awayID === -1) {
            alert('Please select an away team.');
        } else if (this.state.homeID === -1){
            alert('Please select a home team.');
        } else {
            let away = this.state.awayID.toString();
            let count = away.length;
            for (count; count < 5; count++) {
                away = '0' + away;
            }

            let home = this.state.homeID.toString();
            count = home.length;
            for (count; count < 5; count++) {
                home = '0' + home;
            }

            let new_id = away + home + 'XX';
            this.props.callback(new_id);
        }
    }

    setSelectingAway(bool) {
        this.setState({
            selectingAway: bool
        });
    }

    setYear(year) {
        this.setState({
            year: year
        });
        this.getTeamsForSeason(year);
    }

    setTeamList(teamList) {
        this.setState({
            teamsForYear: teamList,
            teamSelected: teamList.length > 0 ? teamList[0] : null
        });
        this.getSelectedTeamGames(this.state.year, teamList[0]);
    }

    setTeamSelected(team) {
        this.setState({
            teamSelected: team,
            currentGameNumber: ''
        });
        this.getSelectedTeamGames(this.state.year, team);
    }

    getTeamsForSeason(season) {
        let endpoint = 'teamsforseason=' + season.toString();
        this.state.requestManager.fetchData(endpoint, this.setTeamList);
    }

    setSelectedTeamGames(gameList) {
        this.setState({
            selectedTeamGames: gameList,
        });
    }

    getSelectedTeamGames(season, team) {
        let endpoint = 'seasonstatoverview/season=' + season + '&team=' + team;
        this.state.requestManager.fetchData(endpoint, this.setSelectedTeamGames);
    }

    updateGameNumber(evt) {
        let val = parseInt(evt.target.value);

        let max_game = this.state.selectedTeamGames.length - 1;
        if (isNaN(val) || val < 0) {
            if (evt.target.value === "") {
                val = "";
            } else {
                val = 1;
            }
        } else if (val > max_game) {
            val = max_game;
        }
        this.setState({
            currentGameNumber: val
        });
    }

    selectButtonPressed() {
        if (this.state.currentGameNumber === "") {
            alert('Please enter a number');
        } else {
            let details = this.state.selectedTeamGames[this.state.currentGameNumber];
            let id = details['stat_id'];
            let name = details['full_name'];
            let str = this.state.year.toString() + ' ' + name + ' (game ' + this.state.currentGameNumber.toString() + ')';
            if (this.state.selectingAway) {
                this.setState({
                    awayString: str,
                    awayID: id
                });
            } else {
                this.setState({
                    homeString: str,
                    homeID: id
                });
            }
        }

    }

    generateListItems(teamList) {
        const li_style = {
            display: 'inline-block',
            backgroundColor: 'white',
            border: '1px black solid',
            cursor: 'pointer',
            width: 'calc(' + (100.0 / 6) + '% - 2px)',
        };
        const selected_style = Object.assign({}, li_style, {backgroundColor: 'red'});
        const img_style = {
            margin: '0px auto',
            display: 'block',
            backgroundColor: 'white',
            borderRadius: '25px'
        };

        let util = new UIUtilities();
        return teamList.map((teamAbbr) =>
            <li style={this.state.teamSelected === teamAbbr ? selected_style : li_style} key={teamAbbr} onClick={_.partial(this.setTeamSelected, teamAbbr)}>
                <img src={util.getLogoURL(teamAbbr)} width="50px" height="50px" style={img_style}/>
                <p style={{margin: '0px', textAlign: 'center', fontSize: 'small'}}>
                    {teamAbbr}
                </p>
            </li>
        );
    }

    render() {
        const outer_style = {
            width: 'calc(100% - 4px)',
            border: '2px #aaaaaa inset',
            background: 'white'
        };

        const description_style = {
            width: '80%',
            display: 'inline-block',
        };

        const button_div_style = {
            display: 'inline-block',
            height: '1em',
            margin: '0.6em 0.4em',
            padding: '4px',
            textAlign: 'center',
            float: 'right',
            border: '2px inset gray',
            cursor: 'pointer',
            backgroundColor: '#aaaaaa'
        };

        const string_style = {
            textAlign: 'center'
        };
        const p_style = {
            marginTop: '0em',
            marginBottom: '0em',
        };

        const ul_style = {
            width: '100%',
            listStyleType: 'none',
            padding: '0px',
            margin: '0px',
            clear: 'both',
        };

        let away_color = this.state.selectingAway ? 'red' : '#aaaaaa';
        let home_color = this.state.selectingAway ? '#aaaaaa' : 'red';
        let away_cb = _.partial(this.setSelectingAway, true);
        let home_cb = _.partial(this.setSelectingAway, false);

        let current_state = this.state.selectedTeamGames[this.state.currentGameNumber];
        let record = current_state !== undefined ? '(' + current_state['wins'].toString() + '-' + current_state['losses'].toString() + ')' : '(0-0)';
        let net_rating = current_state !== undefined ? current_state['net_rating'].toString() : '0.00';
        let record_string = 'Record: ' + record;
        let net_rating_string = ' Net Rating: ' +  net_rating;

        return (
            <div>
                <div style={outer_style}>
                    <div style={button_div_style} onClick={this.goButtonPressed}>
                        Go!
                    </div>
                    <div style={description_style}>
                        <div style={string_style}>
                            <strong>
                                {this.state.awayString}
                            </strong>
                        </div>
                        <div style={string_style}>
                            vs.
                        </div>
                        <div style={string_style}>
                            <strong>
                                {this.state.homeString}
                            </strong>
                        </div>
                    </div>
                </div>
                <div>
                    <InlineButton text="Away Team" total={2} color={away_color} callback={away_cb}/>
                    <InlineButton text="Home Team" total={2} color={home_color} callback={home_cb}/>
                </div>
                <YearBar callback={this.setYear}/>
                <ul style={ul_style}>
                    {this.generateListItems(this.state.teamsForYear)}
                </ul>
                <div style={outer_style}>
                    <div style={button_div_style} onClick={this.selectButtonPressed}>
                        Select
                    </div>
                    <div style={description_style}>
                        <div style={{width: '40%', margin: '1em 0.5em', display: 'inline-block'}}>
                            Game Number:
                            <input size={2} maxLength={2} value={this.state.currentGameNumber} onChange={this.updateGameNumber}/>
                        </div>
                        <div style={{ display: 'inline-block', margin: '0.5em 0em'}}>
                            <p style={p_style}>{record_string}</p>
                            <p style={p_style}>{net_rating_string}</p>
                        </div>

                    </div>
                </div>
            </div>

        );
    }
}
export default CustomMatchupBar;