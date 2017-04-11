import React from 'react';
import GameBasics from './GameBasics';
import RequestManager from './RequestManager';
import BoxWrapper from './BoxWrapper';


/**
 * This class holds all of the sub-elements of the window displaying the game
 */
class GameWindow extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          game_id: this.props.game,
          game_data: {},
          request_manager   : new RequestManager()
      };

      this.setData = this.setData.bind(this);
  }

  setData(data) {
    this.setState({
        game_data: data
    });
  }

  componentWillReceiveProps(nextProps) {
      var endpoint = 'gameinformation=' + nextProps.game;
      this.setState({game_id: nextProps.game});
      this.state.request_manager.fetchData(endpoint, this.setData);
  }

  render() {
    const style = {
        float: 'right',
        width: 'calc(65% - 10px)',
        height: 'calc(100% - 20px)',
        background: 'black',
        display: 'inline-block',
        margin: '5px',
        padding: '0px',
        border: '1px solid black',
        borderRadius: '5px'
    };

    return (
      <div style={style} id="gamewindow">
        <GameBasics data={this.state.game_data}/>
        <BoxWrapper data={this.state.game_data} game_callback={this.props.game_callback}/>
      </div>

    );
  }
}
export default GameWindow;
