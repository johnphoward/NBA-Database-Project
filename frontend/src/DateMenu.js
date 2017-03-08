import React from 'react';
import _ from 'underscore';
import VerticalMenu from './VerticalMenu';

/*
    Special implementation of VerticalMenu to carry out date selection
*/

class DateMenu extends VerticalMenu {
  constructor(props) {
    super(props);
    this.setDate = this.setDate.bind(this);
  }

  setDate(evt, dateString) {
    this.props.callback(dateString);
  }

  generateListItems() {
    const li_style = {};

    const dateList = this.props.dateArray.map((dateString) =>
        <li key={dateString} style={li_style} onClick={_.partial(this.setDate, _, dateString)}>
            {dateString}
        </li>
    );

    return dateList;
  }
}
export default DateMenu;