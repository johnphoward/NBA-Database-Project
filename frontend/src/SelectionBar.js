import React from 'react';
import InlineButton from './InlineButton';
import YearBar from './YearBar';
import DateMenu from './DateMenu';
import GameMenu from './GameMenu';
import DataFetcher from './DataFetcher';


/**
 * This will be the base of the bar for selecting the game to display
 */

class SelectionBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        scheduled: true,
        year: null,
        currentYearData: {},
        date: null,
        dateArray: [],
        game: null,
        gameArray: [],
        dataFetcher: new DataFetcher()
    };

    this.showScheduled = this.showScheduled.bind(this);
    this.showCustom = this.showCustom.bind(this);
    this.setYearForBar = this.setYearForBar.bind(this);
    this.setDateForBar = this.setDateForBar.bind(this);
    this.setGameForBar = this.setGameForBar.bind(this);
    this.loadSchedule = this.loadSchedule.bind(this);
  }

  showScheduled() {
    this.setState({scheduled: true});
  }

  showCustom() {
    this.setState({scheduled: false});
  }

  loadSchedule(data) {
    this.setState({
        currentYearData: data,
        dateArray: Object.keys(data)
    });
  }

  setYearForBar(year) {
    this.setState({
        year: year,
        dateArray: [],
        gameArray: []
    });
    var endpoint = 'scheduleforseason=' + year.toString();

    this.state.dataFetcher.fetchData(endpoint, this.loadSchedule);
  }

  setDateForBar(date) {
    this.setState({
        date: date,
        gameArray: this.state.currentYearData[date]
    });
  }

  setGameForBar(givenGame) {
    this.setState({game: givenGame});
    if (this.props.game_callback != null) {
      this.props.game_callback(givenGame);
    }
  }

  componentDidMount() {
    var today = new Date();
    var season = today.getMonth() > 8 ? today.getFullYear() + 1 : today.getFullYear();
    this.setYearForBar(season);
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
        width: '100%',
        float: 'left',
        bottom: '0px',
        height: '80%'
    };

    const top_div_style = {
        position: 'absolute',
        width: '100%',
        top: '0px',
    }

    return (
      <div style={bar_style} id="selectionbar">
        <div style={top_div_style}>
            <h2 style={header_style}>Select a game to view</h2>
            <InlineButton text="Scheduled" total={2} callback={this.showScheduled}/>
            <InlineButton text="Customized" total={2} callback={this.showCustom}/>
            <YearBar callback={this.setYearForBar}/>
        </div>

        {this.state.scheduled ? (
            <div style={menu_div_style}>
                <DateMenu dateArray={this.state.dateArray} callback={this.setDateForBar}/>
                <GameMenu gameArray={this.state.gameArray} callback={this.setGameForBar}/>
            </div>
        ) : (
            <div>Custom</div>
        )}

      </div>
    );
  }
}
export default SelectionBar;
