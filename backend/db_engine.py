import MySQLdb
from itertools import groupby
from json import dumps

HOST = 'localhost'
USER = 'root'
PASSWORD = 'rootsqlpword'
DATABASE = 'nba_stats'


class Engine:
    """ For all database related connections """

    def __init__(self):
        self.db = MySQLdb.connect(HOST, USER, PASSWORD, DATABASE)
        self.cursor = self.db.cursor()

    def insert_box_score(self, data_tuple):
        """ Insert one box score into box_scores table at a time """
        table_name = 'box_scores'
        cmd = "INSERT INTO %s VALUES %s;" % (table_name, str(data_tuple))
        self.cursor.execute(cmd)

    @staticmethod
    def game_tuple_to_game(game_tup):
        """ Helper to convert tuple from database to a dictionary of the game values"""
        return {
            'game_id': game_tup[0],
            'date': str(game_tup[2]) + '/' + str(game_tup[3]) + '/' + str(game_tup[1]),
            'away': game_tup[4],
            'home': game_tup[5]
        }

    def get_team_schedule_for_year(self, team_abbr, year):
        """ Get a list of a team's games for a given season """
        pass

    def get_league_schedule_for_season(self, year):
        """ Get a list of all scheduled games in the league for a given season """
        cmd = ("SELECT game_id, year, month, day, away_team, home_team "
               "FROM schedule "
               "WHERE season_year=%s "
               "ORDER BY game_id" % year)
        self.cursor.execute(cmd)
        games = map(self.game_tuple_to_game, self.cursor.fetchall())
        grouped = dumps({k: list(v) for k, v in groupby(games, lambda g: g['game_id'][:8])})
        return grouped

    def get_teams_in_league(self, year):
        """ Get a list of all teams competing for a given season from teams  """
        pass

    def insert_scheduled_games(self, games_list):
        """ Insert a list of games from the schedule into the schedule table"""
        table_name = 'schedule'
        games_string = ', '.join(map(str, games_list))
        cmd = "INSERT INTO %s VALUES %s;" % (table_name, games_string)
        self.cursor.execute(cmd)

    def commit_changes(self):
        """ Commit all changes to the database """
        self.db.commit()
