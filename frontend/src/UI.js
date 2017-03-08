import React from 'react';
import SelectionBar from './SelectionBar';
import GameWindow from './GameWindow';

/**
 * The base class from which the UI will be built
 */
class UI extends React.Component {
  render() {
    const style = {
        width: '90%',
        minWidth: '1000px',
        height: '100%',
        minHeight: '550px',
        background: '#AAFF99',
        marginBottom: '0px',
        marginTop: '0px',
        position: 'fixed',
        left: '50%',
        marginLeft: '-45%'
    }

    return (
        <div style={style} id="myui">
            <SelectionBar />
            <GameWindow />
        </div>
    );
  }
}
export default UI;

