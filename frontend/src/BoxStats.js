import React from 'react';
import _ from 'underscore';
import SimulationWindow from './SimulationWindow';

/**
 * Display all stats from game
 */
class BoxStats extends React.Component {
    constructor(props) {
        super(props);

        // this.populateBoxScore = this.populateBoxScore.bind(this);
    }


    generateBoxScore(away, home, data, real_data) {
        const stats_needed = ['points', 'fg', '3p', 'ft', 'orb', 'drb', 'ast', 'stl','blk', 'tov'];
        const stat_names = ['Points', 'Field Goals', '3PT Field Goals', 'Free Throws', 'Offensive Rebounds', 'Defensive Rebounds', 'Assists', 'Steals', 'Blocks', 'Turnovers'];
        const pct_stats = ['fg', '3p', 'ft'];

        const stat_map_fn = function (home_or_away, stat_str) {
            if (!real_data) {
                return '-';
            } else if (pct_stats.includes(stat_str)) {
                var made = data[home_or_away][stat_str + 'm'];
                var missed = data[home_or_away][stat_str + 'a'];
                return made.toString() + "/" + missed.toString() + ' (' + (made * 100.0 / missed).toFixed(1) + '%)';
            } else {
                return data[home_or_away][stat_str].toString();
            }
        };

        const get_away_stats = _.partial(stat_map_fn, 'away', _);
        const get_home_stats = _.partial(stat_map_fn, 'home', _);

        const h2_style = {
            width: '30%',
            display: 'inline-block',
            textAlign: 'center',
            margin: '8px 0px',
            textDecoration: 'underline'
        };

        const away_style = Object.assign({}, h2_style, {float: 'left'});
        const home_style = Object.assign({}, h2_style, {float: 'right'});

        const vanishing_style = {
            width: '40%',
            display: 'inline-block',
            textAlign: 'center',
            color: 'white',
            margin: '8px 0px',
        };

        const header_size = 44;
        const line_size = 18;

        const ul_style = {
            margin: '0px',
            listStyleType: 'none',
            padding: '0px'
        };

        const base_style = {
            width: '30%',
            display: 'inline-block',
            textAlign: 'center',

        };

        const left_style = Object.assign({}, base_style, {float: 'left'});
        const right_style = Object.assign({}, base_style, {float: 'right'});
        const center_style = Object.assign({}, base_style, {width: '40%'});
        const size_style = {
            marginBottom: 'calc((100% - ' + header_size + 'px - ' + (10 * line_size) + 'px) / 10)'
        };


        var away_stats = stats_needed.map(get_away_stats);
        var home_stats = stats_needed.map(get_home_stats);

        var pairs = _.zip(stats_needed, away_stats, stat_names, home_stats);

        var list_items = pairs.map((stat_list) =>
            <li style={size_style} key={stat_list[0]}>
                <div style={left_style}>
                    {stat_list[1]}
                </div>
                <div style={center_style}>
                    <b>{stat_list[2]}</b>
                </div>
                <div style={right_style}>
                    {stat_list[3]}
                </div>
            </li>);

        return (
            <div>
                <h2 style={away_style}>
                    {away}
                </h2>
                <h2 style={vanishing_style}>.</h2>
                <h2 style={home_style}>
                    {home}
                </h2>
                <ul style={ul_style}>
                    {list_items}
                </ul>
            </div>
        );
    }


    render() {
        const outer_style = {
            width: 'calc(100% - 10px)',
            height: 'calc(60% - 10px)',
            background: '#555555',
            display: 'inline-block',
            margin: '5px',
            padding: '0px',
            border: '1px solid black',
            borderRadius: '5px',

        };

        const inner_style = {
            width: 'calc(50% - 10px)',
            height: 'calc(100% - 10px)',
            background: 'white',
            display: 'inline-block',
            margin: '5px 4px',
            border: '1px solid black',
            borderRadius: '5px',
            float: 'left',
            overflow: 'scroll'
        };

        var real_data = (Object.keys(this.props.data).length > 0);

        var data = real_data ? this.props.data['box_score']: {};
        var away = real_data ? this.props.data['away'] : 'GSW';
        var home = real_data ? this.props.data['home'] : 'OKC';

        return (
            <div style={outer_style}>
                <div style={inner_style}>
                    {this.generateBoxScore(away, home, data, real_data)}
                </div>
                <SimulationWindow />
            </div>

        );
    }
}

export default BoxStats;