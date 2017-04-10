import React from 'react';

/**
 * This class allows you to define multiple buttons consecutively in a line and give them callbacks
 */
class InlineButton extends React.Component {

  render() {
    const width = 100.0 / this.props.total;
    const borderSize = 2;

    const style = {
        display: 'inline-block',
        textAlign: 'center',
        width: 'calc(' + width + '% - ' + 2 * borderSize + 'px)',
        border: borderSize + 'px solid black',
        paddingTop: '10px',
        paddingBottom: '10px',
        margin: '0px',
        backgroundColor: this.props.color !== undefined ? this.props.color : '#aaaaaa',
        cursor: 'pointer',
    };

    return (
        <h3 style={style} onClick={this.props.callback}>{this.props.text}</h3>
    );
  }
}
export default InlineButton;
