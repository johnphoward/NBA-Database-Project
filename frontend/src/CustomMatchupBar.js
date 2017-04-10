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
            awayYear: -1,
            awayName: -1,
            awayGameNo: -1,
            homeID: -1,
            homeYear: -1,
            homeName: -1,
            homeGameNo: -1,
            selectingAway: true,
            year: 2017,
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

        this.getTeamsForSeason(this.state.year);
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
        })
    }

    setTeamSelected(team) {
        this.setState({
            teamSelected: team
        });
        this.getSelectedTeamGames(this.state.year, team);
    }

    getTeamsForSeason(season) {
        let endpoint = 'teamsforseason=' + season.toString();
        this.state.requestManager.fetchData(endpoint, this.setTeamList);
    }

    setSelectedTeamGames(gameList) {
        this.setState({
            selectedTeamGames: gameList
        });
    }

    getSelectedTeamGames(season, team) {
        let endpoint = 'seasonstatoverview/season=' + season + '&team=' + team;
        this.state.requestManager.fetchData(endpoint, this.setSelectedTeamGames);
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
            width: '85%',
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

        const ul_style = {
            width: '100%',
            listStyleType: 'none',
            padding: '0px',
            margin: '0px',
            clear: 'both',
        };

        let away_color = this.state.selectingAway ? 'green' : '#aaaaaa';
        let home_color = this.state.selectingAway ? '#aaaaaa' : 'green';
        let away_cb = _.partial(this.setSelectingAway, true);
        let home_cb = _.partial(this.setSelectingAway, false);

        return (
            <div>
                <div style={outer_style}>
                    <div style={button_div_style}>
                        Go!
                    </div>
                    <div style={description_style}>
                        <div style={string_style}>
                            <strong>
                                No team selected
                            </strong>
                        </div>
                        <div style={string_style}>
                            vs.
                        </div>
                        <div style={string_style}>
                            <strong>
                                No team selected
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
                    <div style={button_div_style}>
                        Select
                    </div>
                    <div style={description_style}>
                        <div>
                            Game number: 
                        </div>

                    </div>
                </div>
            </div>

        );
    }
}
export default CustomMatchupBar;