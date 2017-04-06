import React from 'react';
import UIUtilities from './UIUtilities';

/**
 * Renders an image, name, record and score in a game (or none if it hasn't happened yet
 */
class PerGameDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.generateListItems = this.generateListItems.bind(this);
        this.util = new UIUtilities();
    }

    generateListItems() {
        var border_size = 4;
        const stat_names = ['ppg', 'fgmpg', 'fgapg', 'fg_pct', '3fg_pct', 'ft_pct', 'apg', 'orpg', 'drpg', 'stlpg', 'tovpg'];
        const name_lookup = {
            'ppg': 'Points',
            'fgmpg': 'FG Made',
            'fgapg': 'FG Attempts',
            'fg_pct': 'FG %',
            '3fg_pct': '3PT %',
            'ft_pct': 'FT %',
            'apg': 'Assists',
            'orpg': 'Off. Rebounds',
            'drpg': 'Def. Rebounds',
            'stlpg': 'Steals',
            'blkpg': 'Blocks',
            'tovpg': 'Turnovers'
        };

        const base_style = {
            display: 'inline-block',
            textAlign: 'center',
            fontSize: '13px',
            width: 'calc(30% - ' + (2 * border_size) + 'px)',
            verticalAlign: 'top',
            borderTop: '1px black solid',
            borderBottom: '2px black solid'
        };

        var left_color = this.util.teamColorLookup[this.props.away];
        var right_color = this.util.teamColorLookup[this.props.home];

        var left_style_addons = {
            float: 'left',
            borderLeft: '4px solid ' + left_color,
            borderRight: '4px solid ' + left_color
        };
        var right_style_addons = {
            float: 'right',
            borderLeft: '4px solid ' + right_color,
            borderRight: '4px solid ' + right_color
        };

        var left_style = Object.assign({}, base_style, left_style_addons);

        var right_style = Object.assign({}, base_style, right_style_addons);
        var center_style = Object.assign({}, base_style, {width: '40%'});

        return stat_names.map((statString) =>
            <li key={statString}>
                <div style={left_style}>
                    {this.props.real_data ? this.props.stats['away'][statString].toFixed(1) : '-'}
                </div>
                <div style={center_style}>
                    {name_lookup[statString]}
                </div>
                <div style={right_style}>
                    {this.props.real_data ? this.props.stats['home'][statString].toFixed(1) : '-'}
                </div>
            </li>
        );

    }

    render() {
        var border_size = 1;

        var div_style = {
            width: 'calc(50% - ' + (2 * border_size) + 'px',
            height: 'calc(100% - ' + (2 * border_size) + 'px',
            background: 'white',
            padding: '0px',
            borderTopLeftRadius: '5px',
            borderBottomLeftRadius: '5px',
            border: border_size + 'px solid black',
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
                <h3 style={h3_style}>Per Game Averages</h3>
                <ul style={ul_style}>
                    {list_items}
                </ul>
            </div>

        );
    }
}
export default PerGameDisplay;
