import numpy as np
from backend.db_engine import Engine
from backend.settings import SEASON_LIST


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

        # self.engine.create_stored_procedure()