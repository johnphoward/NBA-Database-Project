import React from 'react';

var _ = require('underscore');

/**
 * For selecting the year of the selection window
 */
class YearBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {year: 2017};
    this.setYear = this.setYear.bind(this);
  }

  setYear(evt, newYear) {
      this.setState({year: newYear});
      this.props.callback(newYear);
  }

  render() {
    const div_style= {
        background: 'black',
        color: 'white',
        textAlign: 'center'
    };

    const ul_style = {
        listStyleType: 'none',
        padding: '0px',
        margin: '0px',
        overflow: 'scroll'
    };

    const li_style = {
        display: 'inline',
        marginRight: '8px'
    };

    const years = _.range(1987, 2018);
    const year_list = years.map((yr) =>
        <li key={yr} style={li_style} onClick={_.partial(this.setYear, _, yr)}>
            {yr}
        </li>
    );

    return (
      <div id="yearbar" style={div_style}>
        <div>Year</div>
        <div>
          <ul style={ul_style}>
              {year_list}
          </ul>
        </div>
      </div>
    );
  }
}
export default YearBar;
