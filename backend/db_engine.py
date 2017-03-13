import MySQLdb
from itertools import groupby
from json import dumps
from datetime import date

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

    def insert_all_team_data(self):
        team_data = [
            ('WSB', 'Washington Bullets', 'Washington', 'Bullets'),
            ('CLE', 'Cleveland Caveliers', 'Cleveland', 'Caveliers'),
            ('MIL', 'Milwaukee Bucks', 'Milwaukee', 'Bucks'),
            ('DEN', 'Denver Nuggets', 'Denver', 'Nuggets'),
            ('BOS', 'Boston Celtics', 'Boston', 'Celtics'),
            ('PHO', 'Phoenix Suns', 'Phoenix', 'Suns'),
            ('LAC', 'Los Angeles Clippers', 'Los Angeles', 'Clippers'),
            ('HOU', 'Houston Rockets', 'Houston', 'Rockets'),
            ('DET', 'Detroit Pistons', 'Detroit', 'Pistons'),
            ('SEA', 'Seattle Supersonics', 'Seattle', 'Supersonics'),
            ('SAC', 'Sacramento Kings', 'Sacramento', 'Kings'),
            ('NJN', 'New Jersey Nets', 'New Jersey', 'Nets'),
            ('ATL', 'Atlanta Hawks', 'Atlanta', 'Hawks'),
            ('PHI', 'Philadelphia 76ers', 'Philadelphia', '76ers'),
            ('LAL', 'Los Angeles Lakers', 'Los Angeles', 'Lakers'),
            ('GSW', 'Golden State Warriors', 'Golden State', 'Warriors'),
            ('NYK', 'New York Knicks', 'New York', 'Knicks'),
            ('CHI', 'Chicago Bulls', 'Chicago', 'Bulls'),
            ('POR', 'Portland Trailblazers', 'Portland', 'Trailblazers'),
            ('UTA', 'Utah Jazz', 'Utah', 'Jazz'),
            ('IND', 'Indiana Pacers', 'Indiana', 'Pacers'),
            ('SAS', 'San Antonio Spurs', 'San Antonio', 'Spurs'),
            ('DAL', 'Dallas Mavericks', 'Dallas', 'Mavericks'),
            ('CHH', 'Charlotte Hornets', 'Charlotte', 'Hornets'),
            ('MIA', 'Miami Heat', 'Miami', 'Heat'),
            ('MIN', 'Minnesota Timberwolves', 'Minnesota', 'Timberwolves'),
            ('ORL', 'Orlando Magic', 'Orlando', 'Magic'),
            ('VAN', 'Vancouver Grizzlies', 'Vancouver', 'Grizzlies'),
            ('TOR', 'Toronto Raptors', 'Toronto', 'Raptors'),
            ('WAS', 'Washington Wizards', 'Washington', 'Wizards'),
            ('MEM', 'Memphis Grizzlies', 'Memphis', 'Grizzlies'),
            ('NOH', 'New Orleans Hornets', 'New Orleans', 'Hornets'),
            ('CHA', 'Charlotte Bobcats', 'Charlotte', 'Bobcats'),
            ('NOK', 'New Orleans/Oklahoma City Hornets', 'New Orleans/Oklahoma City', 'Hornets'),
            ('OKC', 'Oklahoma City Thunder', 'Oklahoma City', 'Thunder'),
            ('BRK', 'Brooklyn Nets', 'Brooklyn', 'Nets'),
            ('NOP', 'New Orleans Pelicans', 'New Orleans', 'Pelicans'),
            ('CHO', 'Charlotte Hornets', 'Charlotte', 'Hornets')
        ]

        table_name = 'teams'
        games_string = ', '.join(map(str, team_data))
        cmd = "INSERT INTO %s VALUES %s;" % (table_name, games_string)
        self.cursor.execute(cmd)
        self.commit_changes()

    def get_teams_in_league(self, year):
        """ Get a list of all teams competing for a given season from teams """
        cmd = ("SELECT DISTINCT away_team "
               "FROM schedule "
               "WHERE season_year=%d;" % year)

        self.cursor.execute(cmd)
        return map(lambda tup: tup[0], list(self.cursor.fetchall()))

    def get_game_ids_to_gather(self):
        """
        Get all games for which box scores have not been gathered.
        Only includes games which happened prior to today's date (otherwise box score will not exist online)
        """
        today = date.today()
        date_string = today.strftime('%Y%m%d')
        cmd = ("SELECT game_id "
               "FROM schedule "
               "WHERE game_id NOT IN (SELECT game_id from box_scores) "
               "AND game_id < '%s';" % date_string)

        self.cursor.execute(cmd)
        return map(lambda tup: tup[0], list(self.cursor.fetchall()))

    def insert_scheduled_games(self, games_list):
        """ Insert a list of games from the schedule into the schedule table"""
        table_name = 'schedule'
        games_string = ', '.join(map(str, games_list))
        cmd = "INSERT INTO %s VALUES %s;" % (table_name, games_string)
        self.cursor.execute(cmd)

    def commit_changes(self):
        """ Commit all changes to the database """
        self.db.commit()
