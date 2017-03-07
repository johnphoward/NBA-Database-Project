import React from 'react';

/**
 * This class holds all of the sub-elements of the window displaying the game
 */
class GameWindow extends React.Component {

  render() {
    const style = {
        float: 'right',
        width: 'calc(65% - 10px)',
        height: 'calc(100% - 20px)',
        background: 'yellow',
        display: 'inline-block',
        margin: '5px',
        padding: '0px',
        border: '1px solid black',
        borderRadius: '5px'
    };

    return (
      <div style={style} id="gamewindow">GameWindow</div>
    );
  }
}
export default GameWindow;
