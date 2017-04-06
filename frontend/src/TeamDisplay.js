import React from 'react';
import UIUtilities from './UIUtilities';

/**
 * Renders an image, name, record and score in a game (or none if it hasn't happened yet
 */
class TeamDisplay extends React.Component {

  render() {
    var utilities = new UIUtilities();
    var border_size = 1;
    const h3_size = 22;

    var div_style = {
        width: 'calc(100% - ' + (2 * border_size) + 'px',
        height: 'calc(50% - ' + (h3_size / 2 + 2 * border_size) +  'px)',
        background: 'white',
        padding: '0px',
        border: border_size + 'px solid black',
        overflow: 'hidden'
    };

    if (this.props.bottom) {
        div_style = Object.assign(div_style, {borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px'});
    }

    const img_style = {
        float: 'left',
        border: border_size + 'px solid black',
        margin: '10px 5px 10px 5px',
        background: '#39fad2',
        borderRadius: '15px',
        width: '60px',
        height: '60px'
    };

    const img_div_style = {
        float: 'left',
        display: 'inline-block',
        height: '100%'
    };

    var len = Math.max(this.props.team_location.length, this.props.team_name.length);
    var name_size;
    if (len > 18) {
        name_size = 13;
    } else if (len > 12) {
        name_size = 22;
    } else if (len > 8) {
        name_size = 24;
    } else {
        name_size = 26;
    }

    var name_style = {
        margin: '0px',
        marginLeft: '5px',
        fontSize: name_size + 'px'
    }

    var score_div_style = Object.assign({}, img_div_style, {float: 'right'});
    const score_style = {
        margin: '0px 5px',
        fontSize: '28px',
        textAlign: 'center',
        position: 'relative',
        top: 'calc(50% - ' + 14 + 'px)'
    };


    return (
      <div style={div_style}>
        <div style={img_div_style}>
            <img src = {utilities.getLogoURL(this.props.team_abbr, 60, 60)} style={img_style}/>
            <p style={{margin: '0px', textAlign: 'center'}}>{this.props.record}</p>
        </div>
        <div style={img_div_style}>
            <h3 style={Object.assign({}, name_style, {marginTop: '20px', color: '#666666'})}>{this.props.team_location}</h3>
            <h3 style={name_style}>{this.props.team_name}</h3>
        </div>
        <div style={score_div_style}>
            <h3 style={score_style}>{this.props.score}</h3>
        </div>
      </div>

    );
  }
}
export default TeamDisplay;
