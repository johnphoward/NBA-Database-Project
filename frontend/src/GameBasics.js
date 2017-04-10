import React from 'react';

import TeamDisplay from './TeamDisplay';
import PerGameDisplay from './PerGameDisplay';
import AdvancedStatsDisplay from './AdvancedStatsDisplay'

/**
 * Display name, record, logo, score, and stats for the game.
 */
class GameBasics extends React.Component {
  render() {
    const outer_style = {
        width: 'calc(100% - 10px)',
        height: 'calc(40% - 10px)',
        background: '#555555',
        display: 'inline-block',
        margin: '5px',
        padding: '0px',
        border: '1px solid black',
        borderRadius: '5px'
    };

    const details_style = {
        float: "left",
        width: 'calc(40% - 12px)',
        height: 'calc(100% - 12px)',
        background: 'red',
        display: 'inline-block',
        margin: '5px',
        padding: '0px',
        border: '1px solid black',
        borderRadius: '5px'
    };
    const stats_style = {
        float: 'right',
        width: 'calc(60% - 12px)',
        height: 'calc(100% - 12px)',
        background: 'red',
        display: 'inline',
        margin: '5px',
        padding: '0px',
        border: '1px solid black',
        borderRadius: '5px',
        overflow: 'scroll'
    };

    const h3_style = {
        margin: '0px',
        textAlign: 'center'
    };

    let date, away, away_location, away_nickname, away_score, home, home_location, home_nickname, home_score;
    let away_record, home_record;

    if (this.props.data['date'] != undefined) {
        date = this.props.data['date'];
        away = this.props.data['away'];
        away_location = this.props.data['away_team_details']['location'];
        away_nickname = this.props.data['away_team_details']['nickname'];
        away_score = "away" in this.props.data['box_score'] ? this.props.data['box_score']['away']['points'] : "-";
        away_record = "(" + this.props.data['stats']['away']['record'] + ")";
        home = this.props.data['home'];
        home_location = this.props.data['home_team_details']['location'];
        home_nickname = this.props.data['home_team_details']['nickname'];
        home_score = "home" in this.props.data['box_score'] ? this.props.data['box_score']['home']['points'] : "-";
        home_record = "(" + this.props.data['stats']['home']['record'] + ")";
    } else {
        date = "March 3, 2017";
        away = "GSW";
        away_location = "NBA";
        away_nickname = "Team 1";
        away_score = "-";
        away_record = "(73-9)";
        home = "OKC";
        home_location = "NBA";
        home_nickname = "Team 2";
        home_score = "-";
        home_record = "(55-27)";
    }

    let valid_stats = (Object.keys(this.props.data).length > 0);

    return (
      <div style={outer_style} id="gamebasics">
        <div style={details_style} id="basic_details">
          <h3 style={h3_style}>{date}</h3>
          <TeamDisplay team_abbr={away} team_name={away_nickname} team_location={away_location} score={away_score} record={away_record}/>
          <TeamDisplay team_abbr={home} team_name={home_nickname} team_location={home_location} score={home_score} record={home_record} bottom={true}/>
        </div>
        <div style={stats_style} id="basic_stats">
            <PerGameDisplay away={away} home={home} stats={this.props.data['stats']} real_data={valid_stats}/>
            <AdvancedStatsDisplay away={away} home={home} stats={this.props.data['stats']} real_data={valid_stats}/>
        </div>
      </div>
    );
  }
}



export default GameBasics;