import React from 'react';

import TeamDisplay from './TeamDisplay'

/**
 * Display name, record, logo, score, and stats for the game.
 */
class GameBasics extends React.Component {

  render() {
    const mock_data = {
        date: 'March 13, 2017',
        away_team: 'MIA',
        home_team: 'GSW'
    };


    const outer_style = {
        width: 'calc(100% - 10px)',
        height: 'calc(40% - 10px)',
        background: 'cyan',
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
        borderRadius: '5px'
    };

    const h3_style = {
        margin: '0px',
        textAlign: 'center'
    };

    return (
      <div style={outer_style} id="gamebasics">
        <div style={details_style} id="basic_details">
          <h3 style={h3_style}>{mock_data.date}</h3>
          <TeamDisplay team_abbr="GSW" team_name="Warriors" team_location="Golden State" score={110} record="(55-12)"/>
          <TeamDisplay team_abbr="OKC" team_name="Thunder" team_location="Oklahoma City" score={101} record="(44-18)" bottom={true}/>
        </div>
        <div style={stats_style} id="basic_stats">
        "b"
        </div>
      </div>
    );
  }
}
export default GameBasics;
