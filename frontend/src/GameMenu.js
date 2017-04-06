import React from 'react';
import _ from 'underscore';
import VerticalMenu from './VerticalMenu';
import UIUtilities from './UIUtilities';

/*
    Special implementation of VerticalMenu to carry out game selection
*/

class GameMenu extends VerticalMenu {
  constructor(props) {
    super(props);
    this.setGame = this.setGame.bind(this);
  }

  setGame(evt, game) {
    this.props.callback(game);
  }

  generateListItems() {
    const li_style = {
        border: '3px inset #FFFFFF',
    };

    const div1_style = {
        display: 'inline-block',
        width: '100%',
        background: '#16bfdd',
        cursor: 'pointer'
    };

    const im1_style = {
        float: 'left',
        border: '1px solid black',
        margin: '4px',
        background: 'white',
        borderRadius: '15px',
        height: '50px',
        width: '50px'
    };

    const im2_style = {
        float: 'right',
        border: '1px solid black',
        margin: '4px',
        background: 'white',
        borderRadius: '15px',
        height: '50px',
        width: '50px'
    };

    const p1_style = {
        margin: '0px',
        marginTop: '4px',
        color: 'white',
    };

    const p_style = {
        margin: '0px',
        color: 'white'
    };

    var utilities = new UIUtilities();

    const gameList = this.props.gameArray.map((game) =>
        <li key={game['game_id']} style={li_style} onClick={_.partial(this.setGame, _, game['game_id'])}>
            <div style={div1_style}>
                <img src = {utilities.getLogoURL(game['away'], 50, 50)} style={im1_style}/>
                <img src = {utilities.getLogoURL(game['home'], 50, 50)} style={im2_style}/>
                <p style={p1_style}>{game['away']}</p>
                <p style={p_style}>at</p>
                <p style={p_style}>{game['home']}</p>
            </div>
        </li>
    );

    return gameList;
  }
}
export default GameMenu;