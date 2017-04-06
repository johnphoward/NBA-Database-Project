import React from 'react';

/**
 * A menu that takes up half of the width of the SelectionBar, scrolls vertically through values
 */
class VerticalMenu extends React.Component {

  generateListItems() {
    return <p>Loading...</p>;
  }

  render() {
    const width = 50;
    const borderSize = 1;

    const div_style = {
        display: 'inline-block',
        textAlign: 'center',
        width: 'calc(' + width + '% - ' + 2 * borderSize + 'px)',
        height: '100%',
        border: borderSize + 'px solid black',
        margin: '0px',
        backgroundColor: 'grey',
        borderBottomLeftRadius: '5px',
        borderBottomRightRadius: '5px',
        float: 'left'
    };

    const ul_style = {
        listStyleType: 'none',
        padding: '0px',
        margin: '0px',
        overflow: 'scroll',
        maxHeight: '500px'
    };

    var list_items = this.generateListItems();

    return (
        <div style={div_style}>
            <ul style={ul_style}>
                {list_items}
            </ul>
        </div>
    );
  }
}
export default VerticalMenu;
