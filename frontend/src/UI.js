import React from 'react';
import SelectionBar from './SelectionBar';
import GameWindow from './GameWindow';

/**
 * The base class from which the UI will be built
 */
class UI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      game_id: null,
    };

    this.setGame = this.setGame.bind(this);
  }

  setGame(new_game_id) {
    this.setState({game_id: new_game_id});
  }

  render() {
    const style = {
        width: '90%',
        minWidth: '1000px',
        height: '100%',
        minHeight: '550px',
        background: '#BBBBBB',
        marginBottom: '0px',
        marginTop: '0px',
        position: 'fixed',
        left: '50%',
        marginLeft: '-45%'
    };

    return (
        <div style={style} id="myui">
            <SelectionBar game_callback={this.setGame}/>
            <GameWindow game={this.state.game_id} game_callback={this.setGame}/>
        </div>
    );
  }
}
export default UI;

