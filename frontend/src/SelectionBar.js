import React from 'react';
import InlineButton from './InlineButton';
import YearBar from './YearBar';
import DateMenu from './DateMenu';
import GameMenu from './GameMenu';


/**
 * This will be the base of the bar for selecting the game to display
 */
class SelectionBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        scheduled: true,
        year: 2017,
        date: null,
        game: null
    };
    this.showScheduled = this.showScheduled.bind(this);
    this.showCustom = this.showCustom.bind(this);
    this.setGame = this.setGame.bind(this);
  }

  showScheduled() {
    this.setState({scheduled: true});
  }

  showCustom() {
    this.setState({scheduled: false});
  }

  setGame(givenGame) {
    this.setState({game: givenGame});
  }

  render() {
    const bar_style = {
        float: 'left',
        width: 'calc(35% - 10px)',
        height: 'calc(100% - 20px)',
        background: 'red',
        display: 'inline-block',
        position: 'absolute',
        margin: '5px',
        padding: '0px',
        border: '1px solid black',
        borderRadius: '5px'
    };

    const header_style = {
        marginTop: '5px',
        marginBottom: '5px',
        textAlign: 'center',
    };

    const menu_div_style = {
        position: 'absolute',
        bottom: '0px',
        width: '100%',
        height: '80%'
    };

    return (
      <div style={bar_style} id="selectionbar">
        <h2 style={header_style}>Select a game to view</h2>
        <InlineButton text="Scheduled" total={2} callback={this.showScheduled}/>
        <InlineButton text="Customized" total={2} callback={this.showCustom}/>
        <YearBar />

        {this.state.scheduled ? (
            <div style={menu_div_style}>
                <DateMenu dateArray={["a", "b", "c"]}/>
                <GameMenu gameArray={[1, 2, 3]} callback={this.setGame}/>
            </div>
        ) : (
            <div>Custom</div>
        )}

      </div>
    );
  }
}
export default SelectionBar;
