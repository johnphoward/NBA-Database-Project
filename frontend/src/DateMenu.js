import React from 'react';
import _ from 'underscore';
import VerticalMenu from './VerticalMenu';

/*
    Special subclass of VerticalMenu to carry out date selection
*/

class DateMenu extends VerticalMenu {
  constructor(props) {
    super(props);
    this.setDate = this.setDate.bind(this);

    this.state = {date: null};
  }

  setDate(evt, dateString) {
    this.props.callback(dateString);
  }

  generateListItems() {
    const li_style = {
        padding: '2px',
        border: '2px ridge white',
        cursor: 'pointer'
    };

    const dateList = this.props.dateArray.map((dateString) =>
        <li key={dateString} style={li_style} onClick={_.partial(this.setDate, _, dateString)}>
            {parseInt(dateString.substring(4, 6)).toString() + ' / ' +
             parseInt(dateString.substring(6)).toString() + ' / ' +
             dateString.substring(2,4)}
        </li>
    );

    return dateList;
  }
}
export default DateMenu;