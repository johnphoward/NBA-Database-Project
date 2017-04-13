import MySQLdb
from itertools import groupby
from datetime import date

HOST = 'localhost'
USER = 'root'
PASSWORD = 'rootsqlpword'
DATABASE = 'nba_stats'

AWAY_COLUMNS = [
    'away_pts',
    'away_fgm',
    'away_fga',
    'away_3pm',
    'away_3pa',
    'away_ftm',
    'away_fta',
    'away_orb',
    'away_drb',
    'away_apg',
    'away_stl',
    'away_blk',
    'away_tov'
]

AWAY_POS_COLUMNS = [
    'away_pts',
    'away_fgm',
    'away_fga',
    'away_fta',
    'away_orb',
    'away_drb',
    'away_tov'
]

HOME_COLUMNS = [
    'home_pts',
    'home_fgm',
    'home_fga',
    'home_3pm',
    'home_3pa',
    'home_ftm',
    'home_fta',
    'home_orb',
    'home_drb',
    'home_ast',
    'home_stl',
    'home_blk',
    'home_tov',
]

HOME_POS_COLUMNS = [
    'home_pts',
    'home_fgm',
    'home_fga',
    'home_fta',
    'home_orb',
    'home_drb',
    'home_tov'
]


class Engine:
    """ For all database related connections """

    def __init__(self):
        self.db = MySQLdb.connect(HOST, USER, PASSWORD, DATABASE)
        self.cursor = self.db.cursor()
        self.db.autocommit(True)

    def insert_box_score(self, data_tuple):
        """ Insert one box score into box_scores table at a time """
        table_name = 'box_scores'
        # replace instances of python None with null for insertion
        game_string = str(data_tuple).replace("None", "null")
        cmd = "INSERT INTO %s VALUES %s;" % (table_name, game_string)
        self.cursor.execute(cmd)

    @staticmethod
    def game_tuple_to_game(game_tup):
        """ Helper to convert tuple from database to a dictionary of the game values"""
        return {
            'game_id': game_tup[0],
            'date': game_tup[1].strftime("%B %-d, %Y"),
            'away': game_tup[2],
            'home': game_tup[3]
        }

    def get_team_games_for_year(self, team_abbr, year):
        """
            Get the box score of a team's games for a given season.
            Games will be organized as team stats first, opponent stats second
        """
        mutual_columns = [
            'schedule.game_id',
            'schedule.away_team',
            'schedule.home_team',
            'minutes'
        ]

        cmd = ('SELECT {cols} from box_scores '
               'join schedule on box_scores.schedule_id=schedule.game_id '
               'where season_year=%d '
               'and {clause};' % year)

        mutual_clause = 'schedule.{away_or_home}_team="%s"' % team_abbr

        away_cmd = cmd.format(cols=', '.join(mutual_columns + AWAY_COLUMNS + HOME_POS_COLUMNS),
                              clause=mutual_clause.format(away_or_home='away'))
        home_cmd = cmd.format(cols=', '.join(mutual_columns + HOME_COLUMNS + AWAY_POS_COLUMNS),
                              clause=mutual_clause.format(away_or_home='home'))

        self.cursor.execute(away_cmd)
        away_games = self.cursor.fetchall()
        self.cursor.execute(home_cmd)
        home_games = self.cursor.fetchall()

        return sorted(list(away_games) + list(home_games), key=lambda tup: tup[0])

    def get_league_schedule_for_season(self, year):
        """ Get a list of all scheduled games in the league for a given season """
        cmd = ("SELECT game_id, date, away_team, home_team "
               "FROM schedule "
               "WHERE season_year=%d "
               "ORDER BY game_id" % year)
        self.cursor.execute(cmd)
        games = map(self.game_tuple_to_game, self.cursor.fetchall())
        grouped = {k: list(v) for k, v in groupby(games, lambda g: g['game_id'][:8])}
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
               "WHERE game_id NOT IN (SELECT schedule_id from box_scores) "
               "AND game_id < '%s';" % date_string)

        self.cursor.execute(cmd)
        return map(lambda tup: tup[0], list(self.cursor.fetchall()))

    def insert_scheduled_games(self, games_list):
        """ Insert a list of games from the schedule into the schedule table"""
        table_name = 'schedule'
        games_string = ', '.join(map(str, games_list))
        cmd = "INSERT INTO %s VALUES %s;" % (table_name, games_string)
        self.cursor.execute(cmd)

    def insert_calculated_team_stats(self, team, year, final_data):
        """ insert a list of tuples consisting of all rows of a team's calculated stats for season"""
        cleanup_cmd = 'DELETE FROM team_stats WHERE team="{tm}" and year={yr}'.format(tm=team, yr=year)
        self.cursor.execute(cleanup_cmd)

        values = ', '.join([str(tuple(row)) for row in final_data])
        insert_cmd = 'INSERT INTO team_stats VALUES ' + values + ';'

        self.cursor.execute(insert_cmd)

    @staticmethod
    def box_score_tuple_to_dict(game_tup):
        if game_tup is None:
            return {}
        return {
            'away': {
                'points': game_tup[3],
                'fgm': game_tup[4],
                'fga': game_tup[5],
                '3pm': game_tup[6],
                '3pa': game_tup[7],
                'ftm': game_tup[8],
                'fta': game_tup[9],
                'orb': game_tup[10],
                'drb': game_tup[11],
                'ast': game_tup[12],
                'stl': game_tup[13],
                'blk': game_tup[14],
                'tov': game_tup[15]
            },
            'home': {
                'points': game_tup[16],
                'fgm': game_tup[17],
                'fga': game_tup[18],
                '3pm': game_tup[19],
                '3pa': game_tup[20],
                'ftm': game_tup[21],
                'fta': game_tup[22],
                'orb': game_tup[23],
                'drb': game_tup[24],
                'ast': game_tup[25],
                'stl': game_tup[26],
                'blk': game_tup[27],
                'tov': game_tup[28]
            },
            'overtime': (game_tup[29] - 48) / 5
        }

    @staticmethod
    def stat_tuple_to_dict(stat_tup):
        if stat_tup is None:
            return {}
        other_stats = map(float, stat_tup[6:])
        return {
            'stat_id': int(stat_tup[0]),
            'record': '%d-%d' % (stat_tup[4], stat_tup[5]),
            'offensive_rating': other_stats[0],
            'defensive_rating': other_stats[1],
            'net_rating': other_stats[2],
            'pace': other_stats[3],
            'ppg': other_stats[4],
            'fgmpg': other_stats[5],
            'fgapg': other_stats[6],
            'fg_pct': other_stats[7],
            '3fgmpg': other_stats[8],
            '3fgapg': other_stats[9],
            '3fg_pct': other_stats[10],
            'ftmpg': other_stats[11],
            'ftapg': other_stats[12],
            'ft_pct': other_stats[13],
            'orpg': other_stats[14],
            'drpg': other_stats[15],
            'apg': other_stats[16],
            'stlpg': other_stats[17],
            'blkpg': other_stats[18],
            'tovpg': other_stats[19],
        }

    @staticmethod
    def overview_tuple_to_dict(overview_tup):
        overview_tup = list(overview_tup)
        stat_names = ['stat_id', 'game_number', 'wins', 'losses', 'net_rating', 'full_name']
        dictionary = dict(zip(stat_names, list(overview_tup)))
        dictionary['net_rating'] = float(dictionary['net_rating'])
        return dictionary

    def get_season_stat_overview(self, season, team):
        stats_to_pull = ['stat_id', 'game_number', 'wins', 'losses', 'net_rating', 'full_name']
        base = 'SELECT {stats} from team_stats join teams on team=team_abbreviation where year={yr} and team="{tm}";'
        cmd = base.format(stats=', '.join(stats_to_pull), yr=season, tm=team)
        self.cursor.execute(cmd)
        results = self.cursor.fetchall()
        return [self.overview_tuple_to_dict(tup) for tup in results]

    def get_game_data(self, game_id):
        """
        return all relevant data for a given game id to front end
        """
        # if character number 10 is a digit, this is a custom match-up. Else this is a scheduled game
        if game_id[9].isdigit():
            away_stat_id = game_id[:5]
            home_stat_id = game_id[5:10]
            response = {}

            first_cmd = 'SELECT * from team_stats where stat_id={stat_id};'
            away_cmd = first_cmd.format(stat_id=int(away_stat_id))
            self.cursor.execute(away_cmd)
            away_background = self.cursor.fetchone()
            home_cmd = first_cmd.format(stat_id=int(home_stat_id))
            self.cursor.execute(home_cmd)
            home_background = self.cursor.fetchone()
            response['stats'] = {
                'away': self.stat_tuple_to_dict(away_background),
                'home': self.stat_tuple_to_dict(home_background)
            }

            response['away'] = away_background[1]
            response['home'] = home_background[1]

            secondary = 'SELECT full_name, location, nickname from teams where team_abbreviation="{tm}"'
            self.cursor.execute(secondary.format(tm=response['away']))
            team_info = self.cursor.fetchone()
            response['away_team_details'] = {'full': team_info[0], 'location': team_info[1], 'nickname': team_info[2]}

            self.cursor.execute(secondary.format(tm=response['home']))
            team_info = self.cursor.fetchone()
            response['home_team_details'] = {'full': team_info[0], 'location': team_info[1], 'nickname': team_info[2]}

            response['box_score'] = {}
            response['date'] = 'Custom Matchup'
            response['game_id'] = game_id

            return response

        else:
            first_cmd = 'SELECT game_id, date, away_team, home_team FROM schedule where game_id="%s";' % game_id
            self.cursor.execute(first_cmd)
            response = self.game_tuple_to_game(self.cursor.fetchone())

            secondary = 'SELECT full_name, location, nickname from teams where team_abbreviation="{tm}"'
            self.cursor.execute(secondary.format(tm=response['away']))
            team_info = self.cursor.fetchone()
            response['away_team_details'] = {'full': team_info[0], 'location': team_info[1], 'nickname': team_info[2]}

            self.cursor.execute(secondary.format(tm=response['home']))
            team_info = self.cursor.fetchone()
            response['home_team_details'] = {'full': team_info[0], 'location': team_info[1], 'nickname': team_info[2]}

            box_cmd = 'SELECT * from box_scores where schedule_id="{game}";'.format(game=game_id)
            self.cursor.execute(box_cmd)
            box_score = self.cursor.fetchone()
            response['box_score'] = self.box_score_tuple_to_dict(box_score)

            season = int(game_id[:4]) + int(int(game_id[4:6]) > 9)
            away_back_cmd = 'Call game_stats("{id}", "{tm}", {yr});'.format(id=game_id, tm=response['away'], yr=season)
            self.cursor.execute(away_back_cmd)
            away_background = self.cursor.fetchone()
            # solve weird Commands out of Sync error by closing after each stored
            self.cursor.close()
            self.cursor = self.db.cursor()
            home_back_cmd = 'Call game_stats("{id}", "{tm}", {yr});'.format(id=game_id, tm=response['home'], yr=season)
            self.cursor.execute(home_back_cmd)
            home_background = self.cursor.fetchone()
            self.cursor.close()
            self.cursor = self.db.cursor()

            response['stats'] = {
                'away': self.stat_tuple_to_dict(away_background),
                'home': self.stat_tuple_to_dict(home_background)
            }

            return response

    def get_stat_row(self, row_id):
        """ Select contents of stat row for given id and convert to dict to return """
        cmd = 'SELECT * FROM team_stats WHERE stat_id="%d"' % row_id
        self.cursor.execute(cmd)
        return self.stat_tuple_to_dict(self.cursor.fetchone())

    @staticmethod
    def convert_sim_to_box_score_tuple(box_score_dict, sim_id):
        front = [None, sim_id, None]
        away = []
        home = []
        for stat in ['points', 'fgm', 'fga', '3pm', '3pa', 'ftm', 'fta', 'orb', 'drb', 'ast', 'stl', 'blk', 'tov']:
            # cast to int just to ensure data in box score is valid
            away.append(int(box_score_dict['away'][stat]))
            home.append(int(box_score_dict['home'][stat]))

        return tuple(front + away + home + [48])

    def save_simulation(self, sim_data):
        """ Insert simulation into database- one entry in simulations table and one in box_scores """
        values = '(0, "{name}", NOW(), {away}, {home})'.format(name=sim_data['save_name'],
                                                               away=sim_data['away_tm_id'],
                                                               home=sim_data['home_tm_id'])
        cmd = 'INSERT INTO simulations VALUES {row};'.format(row=values)
        self.cursor.execute(cmd)
        self.cursor.fetchall()
        self.cursor.execute('SELECT LAST_INSERT_ID();')
        sim_id = int(self.cursor.fetchone()[0])

        box_tuple = self.convert_sim_to_box_score_tuple(sim_data['box_score'], sim_id)
        self.insert_box_score(box_tuple)
        self.commit_changes()
        return sim_id

    @staticmethod
    def sim_tuple_to_dict(sim_tup):
        return {
            'simulation_id': sim_tup[0],
            'save_name': sim_tup[1],
            'timestamp': sim_tup[2].strftime("%m/%d/%y %H:%M"),
            'away_tm_id': sim_tup[3],
            'home_tm_id': sim_tup[4]
        }

    def fetch_saved_simulations(self):
        cmd = 'SELECT * FROM simulations ORDER BY simulation_id DESC LIMIT 25;'
        self.cursor.execute(cmd)
        simulations = self.cursor.fetchall()
        return map(self.sim_tuple_to_dict, simulations)

    def load_simulation(self, sim_id):
        cmd = 'SELECT * FROM box_scores where simulation_id={sim};'.format(sim=sim_id)
        self.cursor.execute(cmd)
        sim = self.cursor.fetchone()
        return self.box_score_tuple_to_dict(sim)

    def update_simulation(self, sim_id, save_name):
        cmd = 'UPDATE simulations set save_name="{name}" where simulation_id={sim_id}'.format(name=save_name,
                                                                                              sim_id=sim_id)
        self.cursor.execute(cmd)
        self.cursor.fetchall()

    def delete_simulation(self, sim_id):
        box_cmd = 'DELETE FROM box_scores where simulation_id={sid}'.format(sid=sim_id)
        self.cursor.execute(box_cmd)
        self.cursor.fetchall()
        sim_cmd = 'DELETE FROM simulations where simulation_id={sid}'.format(sid=sim_id)
        self.cursor.execute(sim_cmd)
        self.cursor.fetchall()
        self.commit_changes()

    def commit_changes(self):
        """ Commit all changes to the database """
        self.db.commit()
