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

  setYear(year) {
      console.log(year);
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
    const year_list = years.map((val) =>
        <li style={li_style} onClick={_.partial(this.setYear(val))}>{val}</li>
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
