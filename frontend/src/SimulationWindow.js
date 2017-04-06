import React from 'react';

/**
 * Display all stats from game
 */
class SimulationWindow extends React.Component {
    render() {
        const outer_style = {
            width: 'calc(50% - 10px)',
            height: 'calc(100% - 10px)',
            background: 'red',
            display: 'inline-block',
            margin: '5px 4px',
            border: '1px solid black',
            borderRadius: '5px',
            float: 'right'
        };

        return (
            <div style={outer_style}>

            </div>
        );
    }
}

export default SimulationWindow;