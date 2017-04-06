import React from 'react';
import UIUtilities from './UIUtilities';

/**
 * Renders an image, name, record and score in a game (or none if it hasn't happened yet
 */
class AdvancedStatsDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.generateListItems = this.generateListItems.bind(this);
        this.util = new UIUtilities();
    }

    generateListItems() {
        const stat_names = ['net_rating', 'offensive_rating', 'defensive_rating', 'pace'];
        const name_lookup = {
            'net_rating': 'Net Rating',
            'offensive_rating': 'Offensive Rating',
            'defensive_rating': 'Defensive Rating',
            'pace': 'Pace'
        };

        const number_div_style = {
            display: 'inline-block',
            textAlign: 'center',
            width: 'calc(50% - 10px)',
            padding: '6px 0px'
        };

        var left_color = this.util.teamColorLookup[this.props.away];
        var right_color = this.util.teamColorLookup[this.props.home];

        var left_style = Object.assign({}, number_div_style, {borderLeft: '5px solid ' + left_color, borderRight: '5px solid ' + left_color});
        var right_style = Object.assign({}, number_div_style, {borderLeft: '5px solid ' + right_color, borderRight: '5px solid ' + right_color});

        const text_style = {
            backgroundColor: '#AAAAAA',
            borderTop: '1px solid black',
            borderBottom: '1px solid black',
            textAlign: 'center',
            clear: 'both'
        };


        return stat_names.map((statString) =>
            <li key={statString}>
                <div style={text_style}>
                    {name_lookup[statString]}
                </div>
                <div style={left_style}>
                    {this.props.real_data ? this.props.stats['away'][statString].toFixed(1) : '-'}
                </div>
                <div style={right_style}>
                    {this.props.real_data ? this.props.stats['home'][statString].toFixed(1) : '-'}
                </div>

            </li>
        );

    }

    render() {
        var border_size = 1;
        const h3_size = 22;

        var div_style = {
            width: 'calc(50% - ' + (2 * border_size) + 'px',
            height: 'calc(100% - ' + (2 * border_size) + 'px',
            background: 'white',
            padding: '0px',
            borderTopRightRadius: '5px',
            borderBottomRightRadius: '5px',
            border: border_size + 'px solid black',
            float: 'right',
            display: 'inline-block'
        };

        const h3_style = {
            margin: '0px',
            textAlign: 'center',
            backgroundColor: 'red'
        };

        var ul_style =  {
            margin: '0px',
            listStyleType: 'none',
            padding: '0px'
        };

        var list_items = this.generateListItems();

        return (
            <div style={div_style}>
                <h3 style={h3_style}>Advanced Stats</h3>
                <ul style={ul_style}>
                    {list_items}
                </ul>
            </div>

        );
    }
}
export default AdvancedStatsDisplay;
