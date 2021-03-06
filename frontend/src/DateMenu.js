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
    this.setState({date: dateString});
    this.props.callback(dateString);
  }

  generateListItems() {
    const li_style = {
        padding: '2px',
        border: '2px ridge white',
        cursor: 'pointer'
    };

    let selected_style = Object.assign({}, li_style, {backgroundColor: 'red'});

    return this.props.dateArray.map((dateString) =>
        <li key={dateString} style={dateString === this.state.date ? selected_style : li_style} onClick={_.partial(this.setDate, _, dateString)}>
            {parseInt(dateString.substring(4, 6)).toString() + ' / ' +
             parseInt(dateString.substring(6)).toString() + ' / ' +
             dateString.substring(2,4)}
        </li>
    );
  }
}
export default DateMenu;