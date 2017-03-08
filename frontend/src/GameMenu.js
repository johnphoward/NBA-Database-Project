import React from 'react';
import _ from 'underscore';
import VerticalMenu from './VerticalMenu';

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

    };

    const gameList = this.props.gameArray.map((gameString) =>
        <li key={gameString} style={li_style} onClick={_.partial(this.setGame, _, gameString)}>
            {gameString}
        </li>
    );

    return gameList;
  }
}
export default GameMenu;