import React from 'react';
import _ from 'underscore';

/**
 * Display all stats from game
 */
class BoxStats extends React.Component {

    generateBoxScore(pairs) {
        const header_size = 44;
        const line_size = 18;
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

        return pairs.map((stat_list) =>
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
    }


    render() {
        let real_data = this.props.data.hasOwnProperty('away');
        let data = this.props.data;

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

        let away_stats = stats_needed.map(get_away_stats);
        let home_stats = stats_needed.map(get_home_stats);

        let data_lists = _.zip(stats_needed, away_stats, stat_names, home_stats);

        const outer_style = {
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

        const h2_style = {
            width: '30%',
            display: 'inline-block',
            textAlign: 'center',
            margin: '8px 0px',
            textDecoration: 'underline'
        };

        const ul_style = {
            margin: '0px',
            listStyleType: 'none',
            padding: '0px'
        };

        const vanishing_style = {
            width: '40%',
            display: 'inline-block',
            textAlign: 'center',
            color: 'white',
            margin: '8px 0px',
        };

        const sim_style = {
            width: '40%',
            display: 'inline-block',
            textAlign: 'center',
            margin: '8px 0px',
            backgroundColor: 'red',
            color: 'white'
        };

        const away_style = Object.assign({}, h2_style, {float: 'left'});
        const home_style = Object.assign({}, h2_style, {float: 'right'});

        return (
            <div style={outer_style}>
                <div>
                    <h2 style={away_style}>
                        {this.props.away}
                    </h2>

                    {this.props.simulation ? (
                        <h2 style={sim_style}>Simulation</h2>
                    ) : (
                        <h2 style={vanishing_style}>.</h2>
                    )}

                    <h2 style={home_style}>
                        {this.props.home}
                    </h2>
                    <ul style={ul_style}>
                        {this.generateBoxScore(data_lists)}
                    </ul>
                </div>
            </div>
        );
    }
}

export default BoxStats;