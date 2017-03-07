import React from 'react';
import VerticalMenu from './VerticalMenu';

/*
    Special implementation of VerticalMenu to carry out date selection
*/

class DateMenu extends VerticalMenu {
  generateListItems() {
    const li_style = {};
    const callback = null;

    const dateList = this.props.dateArray.map((dateString) =>
        <li style={li_style} onClick={callback}>{dateString}</li>
    );

    return dateList;
  }
}
export default DateMenu;