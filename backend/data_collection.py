import requests
from lxml import html
from db_engine import Engine
from data_processing import DataProcessor
from settings import SEASON_LIST, CURRENT_SEASON

ZERO = '0'
SLASH = '/'
MINUTES = 'minutes'
SPREAD = 'spread'
OVER_UNDER = 'over/under'
HTML_SUFFIX = '.html'
BK_REF_URL = 'http://www.basketball-reference.com/boxscores/'
BK_REF_SCHEDULE_URL = 'http://www.basketball-reference.com/leagues/NBA_%s_games-%s.html'
BK_REF_XPATH = '//tfoot//td[@data-stat="%s"]'
BK_REF_SCHEDULE_XPATH = '//*[@id="schedule"]/tbody/tr/'
COVERS_XPATH = '//table[last()]//tr[@class="datarow"]'

REQUEST_HEADERS = {
    'Accept': 'application/json, text/plain, */*',
    'User-Agent': 'Mozilla/5.0 Chrome/54.0.2840.71 Safari/537.36',
    'Referer': 'http://www.basketball-reference.com/'
}


class DataCollector:
    """ For all data collection. """
    def __init__(self):
        self.engine = Engine()
        self.processor = DataProcessor()

    def get_single_box_score(self, game_id):
        """
        Gathers a box score from basketball-reference.com and stores to database.

        Keyword arguments:
        game_id: 12 character long string in form YYYYMMDD0XXX, where
            YYYY is the year
            MM is a 2 digit numeric representation of the month, with zero padding if necessary
            DD is a 2 digit numeric representation of the day, with zero padding if necessary
            XXX is the 3-character abbreviation of the home team,
                i.e. 'BOS' for Boston Celtics or 'NYK' for New York Knicks
        """

        url = BK_REF_URL + game_id + HTML_SUFFIX

        page_response = requests.get(url, headers=REQUEST_HEADERS)
        page_tree = html.fromstring(page_response.content)

        home_stats, away_stats = [], []

        for stat in ['pts', 'fg', 'fga', 'fg3', 'fg3a', 'ft', 'fta', 'orb', 'drb', 'ast', 'stl', 'blk', 'tov']:
            away, home = page_tree.xpath(BK_REF_XPATH % stat)
            away_stats.append(int(away.text.strip()))
            home_stats.append(int(home.text.strip()))

        minutes = int(page_tree.xpath(BK_REF_XPATH % 'mp')[0].text.strip()) / 5

        data_values = tuple([None, None, game_id] + away_stats + home_stats + [minutes])

        self.engine.insert_box_score(data_values)

    def get_season_schedule(self, year):
        """
        Gathers a full season's game schedule by traversing basketball-reference.com
        These will eventually be used by the get_single_box_score method to gather box scores

        Keywords arguments:
        year: int representing the year that a season concludes in i.e. 1986-1987 season is represented by 1987
        """
        schedule = []
        for month in ['october', 'november', 'december', 'january', 'february', 'march', 'april']:
            url = BK_REF_SCHEDULE_URL % (str(year), month)

            page_response = requests.get(url, headers=REQUEST_HEADERS)

            if page_response.status_code == 404:
                continue

            page_tree = html.fromstring(page_response.content)

            game_headers = page_tree.xpath(BK_REF_SCHEDULE_XPATH + 'th')
            away_xpath = 'td[1]/a' if int(year) <= 2000 else 'td[2]/a'
            away_teams = page_tree.xpath(BK_REF_SCHEDULE_XPATH + away_xpath)

            # handle special case for april, where playoff games are displayed on the page
            if month == 'april':
                header_list = page_tree.xpath(BK_REF_SCHEDULE_XPATH + 'th')
                try:
                    end_index = next(index for index, val in enumerate(header_list) if not val.get('class', False))
                except StopIteration:
                    end_index = len(game_headers)
            else:
                end_index = len(game_headers)

            for index, game in enumerate(game_headers):
                if index == end_index:
                    break
                game_code = game.attrib['csk']
                away_url = away_teams[index].attrib['href']
                away_team = away_url.split('/')[2]
                home_team = game_code[-3:]
                game_date = '{}-{}-{}'.format(game_code[:4], game_code[4:6], game_code[6:8])
                schedule.append((game_code, game_date, year, away_team, home_team))

        self.engine.insert_scheduled_games(schedule)
        self.engine.commit_changes()

    def gather_all_scheduled_games(self):
        """
        simple loop to gather all games from 1986 to the present
        """
        print "Loading each season schedule and saving to database:"
        for season in SEASON_LIST:
            print season
            self.get_season_schedule(season)

    def gather_all_box_scores(self):
        """
        Gather all games on schedule. Save after each because this will likely be interrupted at some point
        """
        games = self.engine.get_game_ids_to_gather()
        for game_id in games:
            print game_id
            self.get_single_box_score(game_id)
            self.engine.commit_changes()

    def fill_database_from_scratch(self):
        """ Starting with model but no records, fill in the database """
        # start by loading teams table in
        self.engine.insert_all_team_data()
        # # gather and save all scheduled games into db
        self.gather_all_scheduled_games()
        # gather and save all box scores into db
        self.gather_all_box_scores()
        # calculate all team stats from box scores
        self.processor.complete_database_setup()

    def in_season_update(self):
        self.gather_all_box_scores()
        self.processor.process_all_stats_for_year(CURRENT_SEASON)
