import React from 'react';
import _ from 'underscore';

import VerticalMenu from './VerticalMenu';

/*
    Special implementation of VerticalMenu to carry out date selection
*/

class GameMenu extends VerticalMenu {
  setGame(evt, game) {
    this.props.callback.apply(game);
  }

  generateListItems() {
    const li_style = {};
    const callback = null;


    const gameList = this.props.gameArray.map((gameString) =>
        <li style={li_style} onClick={callback}>{gameString}</li>
    );

    return gameList;
  }
}
export default GameMenu;