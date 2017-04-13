import numpy as np
from random import gauss
from db_engine import Engine
from settings import SEASON_LIST

EFFICIENCY_DEVIATION = 12.0
PACE_DEVIATION = 2.0
OFF_RATING_DEVIATION = 6.0
FGA_DEVIATION = 5.0
FGA3_DEVIATION = 3.5
FG3_PCT_DEVIATION = 8.0
FG2_PCT_DEVIATION = 3.5
FT_PCT_DEVIATION = 6.0
ORB_PCT_DEVIATION = 0.06
ASSIST_DEVIATION = 0.07
TURNOVER_DEVIATION = 3.0
STEAL_DEVIATION = 2.5
BLOCK_DEVIATION = 2.0
LEAGUE_AVG_MISSED_SHOTS = 46


class DataProcessor:

    def __init__(self):
        self.engine = Engine()

    def process_single_season(self, team, year):
        """
            calculate all seasonal stats for a team and return a list of lists for each row that will
            be in the final database
        """
        game_data = self.engine.get_team_games_for_year(team, year)

        team_stats = np.zeros((len(game_data), 21))
        row_base = [0, team, year]

        final_data = [row_base + [0] * 23]
        wins = 0
        losses = 0

        for game_number, game_tuple in enumerate(game_data):
            team_stats[game_number, :] = map(int, game_tuple[3:])
            totals = np.sum(team_stats, axis=0)
            averages = list(totals / (game_number + 1))

            tm_pts, other_pts = game_tuple[4], game_tuple[17]
            won = tm_pts > other_pts
            wins += int(won)
            losses += int(not won)

            total_pts_for, total_pts_against = totals[1], totals[14]
            possessions = self.calc_possessions(totals)
            net_rtg = (total_pts_for - total_pts_against) * 100.0 / possessions
            ortg = total_pts_for * 100.0 / possessions
            drtg = total_pts_against * 100.0 / possessions
            pace = possessions * 48.0 / totals[0]

            fg_pct = totals[2] * 100.0 / totals[3]
            fg3_pct = totals[4] * 100.0 / totals[5]
            ft_pct = totals[6] * 100.0 / totals[7]
            averages = averages[1:4] + [fg_pct] + averages[4:6] + [fg3_pct] + averages[6:8] + [ft_pct] + averages[8:14]

            final_row = row_base + [game_number + 1, wins, losses, ortg, drtg, net_rtg, pace] + averages
            final_data.append(final_row)

        return final_data

    def process_all_stats_for_year(self, year):
        teams = self.engine.get_teams_in_league(year)
        for team in teams:
            processed_data = self.process_single_season(team, year)
            self.engine.insert_calculated_team_stats(team, year, processed_data)

        self.engine.commit_changes()

    @staticmethod
    def calc_possessions(stats):
        """
            calculate the number of possessions based on the formula from basketball-reference.com
        """
        tm_attempt_term = stats[3] + 0.4 * stats[7]
        tm_fg_term = 1.07 * (stats[8] / (stats[8] + stats[9])) * (stats[3] - stats[2])
        tm_possessions = tm_attempt_term - tm_fg_term + stats[13]

        opp_attempt_term = stats[16] + 0.4 * stats[17]
        opp_fg_term = 1.07 * (stats[18] / (stats[18] + stats[19])) * (stats[16] - stats[15])
        opp_possessions = opp_attempt_term - opp_fg_term + stats[20]

        return (tm_possessions + opp_possessions) / 2

    def complete_database_setup(self):
        for season in SEASON_LIST:
            self.process_all_stats_for_year(season)

    @staticmethod
    def calculate_team_shooting(points, pace, stats):
        pace_ratio = pace / stats['pace']
        scoring_ratio = points / stats['ppg']
        fga = int(gauss(stats['fgapg'] * pace_ratio, FGA_DEVIATION))

        fga_3 = int(gauss(stats['3fgapg'] * pace_ratio, FGA3_DEVIATION))
        pct_3pt = max(gauss(stats['3fg_pct'] * scoring_ratio, FG3_PCT_DEVIATION), 0)
        made_3s = int(round(fga_3 * pct_3pt / 100.0, 0))

        remaining_pts = points - made_3s * 3
        avg_two_pt_fgpct = max((stats['fgmpg'] - stats['3fgmpg']) / (stats['fgapg'] - stats['3fgapg']), 0)

        ftm = -1
        # make sure that the randomized values are mathematically valid
        while ftm < 0:
            two_pt_fga = fga - fga_3
            two_pt_fg_pct = gauss(avg_two_pt_fgpct * scoring_ratio * 100.0, FG2_PCT_DEVIATION)
            two_pt_fgm = int(round(two_pt_fga * two_pt_fg_pct / 100.0, 0))
            ftm = remaining_pts - two_pt_fgm * 2
            fgm = two_pt_fgm + made_3s

        ft_pct = gauss(stats['ft_pct'], FT_PCT_DEVIATION)
        fta = int(round(ftm / ft_pct * 100.0, 0))

        return {
            'points': points,
            'fgm': fgm,
            'fga': fga,
            '3pm': made_3s,
            '3pa': fga_3,
            'ftm': ftm,
            'fta': fta
        }

    def generate_simulation(self, away_team_id, home_team_id):
        """
        Simulate an NBA game using the stats of each team and basic gaussian distributions
        Will attempt to create stats that could describe a real game
        This is not a particularly mathematically correct way to simulate necessarily
        :param away_team_id: int id of the away team stat row in DB
        :param home_team_id: int id of the home team stat row in DB
        :return: a box score for a game
        """
        away_stats = self.engine.get_stat_row(away_team_id)
        home_stats = self.engine.get_stat_row(home_team_id)

        # error check that a given game id is valid
        if away_stats == {} or home_stats == {}:
            raise ValueError

        # give a nudge to the home team in the form of a 2.5 point efficiency bump
        efficiency_difference = home_stats['net_rating'] - away_stats['net_rating'] + 2.5
        randomized_diff = gauss(efficiency_difference, EFFICIENCY_DEVIATION)

        average_pace = (home_stats['pace'] + away_stats['pace']) / 2.0
        randomized_pace = gauss(average_pace, PACE_DEVIATION)

        randomized_home_efficiency = gauss(home_stats['offensive_rating'], OFF_RATING_DEVIATION)
        away_efficiency = randomized_home_efficiency - randomized_diff

        # calculate actual point totals now
        away_points = int(away_efficiency * randomized_pace / 100.0)
        home_points = int(randomized_home_efficiency * randomized_pace / 100.0)
        if away_points == home_points:
            away_points += int(efficiency_difference < 0)
            home_points += int(efficiency_difference >= 0)
        
        away_sim = self.calculate_team_shooting(away_points, randomized_pace, away_stats)
        home_sim = self.calculate_team_shooting(home_points, randomized_pace, home_stats)

        away_rebounds_available = away_sim['fga'] - away_sim['fgm'] + away_sim['fta'] - away_sim['ftm']
        expected_oreb_pct = away_stats['orpg'] / (away_stats['orpg'] + home_stats['drpg'])
        oreb_pct = gauss(expected_oreb_pct, ORB_PCT_DEVIATION)
        away_orb = int(round(oreb_pct * away_rebounds_available, 0))
        home_drb = away_rebounds_available - away_orb

        home_rebounds_available = home_sim['fga'] - home_sim['fgm'] + home_sim['fta'] - home_sim['ftm']
        expected_oreb_pct = home_stats['orpg'] / (home_stats['orpg'] + away_stats['drpg'])
        oreb_pct = gauss(expected_oreb_pct, ORB_PCT_DEVIATION)
        home_orb = int(round(oreb_pct * home_rebounds_available, 0))
        away_drb = home_rebounds_available - home_orb

        away_assist_pct = gauss(away_stats['apg'] * 1.0 / away_stats['fgmpg'], ASSIST_DEVIATION)
        away_ast = int(round(away_assist_pct * away_sim['fgm'], 0))
        home_assist_pct = gauss(home_stats['apg'] * 1.0 / home_stats['fgmpg'], ASSIST_DEVIATION)
        home_ast = int(round(home_assist_pct * home_sim['fgm'], 0))

        pt_ratio = home_points * 1.0 / away_points
        away_tov = max(int(round(gauss(away_stats['tovpg'] * pt_ratio, TURNOVER_DEVIATION), 0)), 0)
        home_tov = max(int(round(gauss(home_stats['tovpg'] / pt_ratio, TURNOVER_DEVIATION), 0)), 0)

        away_stl = max(int(round(home_tov - gauss(away_stats['stlpg'], STEAL_DEVIATION), 0)), 0)
        home_stl = max(int(round(away_tov - gauss(home_stats['stlpg'], STEAL_DEVIATION), 0)), 0)

        away_blk_pct = away_stats['blkpg'] / LEAGUE_AVG_MISSED_SHOTS
        home_shots_missed = home_sim['fga'] - home_sim['fgm']
        away_blk = max(int(round(gauss(away_blk_pct * home_shots_missed, BLOCK_DEVIATION), 0)), 0)

        home_blk_pct = home_stats['blkpg'] / LEAGUE_AVG_MISSED_SHOTS
        away_shots_missed = away_sim['fga'] - away_sim['fgm']
        home_blk = max(int(round(gauss(home_blk_pct * away_shots_missed, BLOCK_DEVIATION), 0)), 0)

        away_misc_stats = {
            'orb': away_orb,
            'drb': away_drb,
            'ast': away_ast,
            'stl': away_stl,
            'blk': away_blk,
            'tov': away_tov
        }

        home_misc_stats = {
            'orb': home_orb,
            'drb': home_drb,
            'ast': home_ast,
            'stl': home_stl,
            'blk': home_blk,
            'tov': home_tov
        }

        away_sim.update(away_misc_stats)
        home_sim.update(home_misc_stats)

        return {
            'away': away_sim,
            'home': home_sim
        }
