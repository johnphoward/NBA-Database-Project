import MySQLdb

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

    def get_team_schedule_for_year(self, team_abbr, year):
        """ Get a list of a team's games for a given season """
        pass

    def get_league_schedule_for_season(self, year):
        """ Get a list of all scheduled games in the league for a given season """
        cmd = "SELECT * FROM schedule WHERE season_year=%s ORDER BY gameid" % year
        self.cursor.execute(cmd)
        return self.cursor.fetchall()

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
        self.cursor.commit()
