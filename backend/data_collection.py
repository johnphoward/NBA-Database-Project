import requests
from lxml import html
from backend import db_engine


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
        self.engine = db_engine.Engine()

    def get_single_box_score(self, game_id):
        """
        Gathers a box score from basketball-reference.com and stores to database.

        Keyword arguments:
        game_id: 12 character long string in form YYYYMMDD0XXX, where
            YYYY is the year
            MM is a 2 digit numeric representation of the month, with zero padding if necessary
            DD is a 2 digit numeric representation of the day, with zero padding if necessary
            XXX is the 3-character abbreviation of the home team, i.e. 'BOS' for Boston Celtics or 'NYK' for New York Knicks
        """

        url = BK_REF_URL + game_id + HTML_SUFFIX

        page_response = requests.get(url, headers=REQUEST_HEADERS)
        page_tree = html.fromstring(page_response.content)

        home_stats, away_stats = [], []

        for stat in ['pts', 'fg', 'fga', 'fta', 'orb', 'drb', 'tov']:
            away, home = page_tree.xpath(BK_REF_XPATH % stat)
            away_stats.append(int(away.text.strip()))
            home_stats.append(int(home.text.strip()))

        minutes = int(page_tree.xpath(BK_REF_XPATH % 'mp')[0].text.strip()) / 5

        data_values = tuple([game_id] + away_stats + home_stats + [minutes])

        # self.engine.insert_box_score(data_values)
        return data_values

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
                y, m, d = game_code[:4], game_code[4:6], game_code[6:8]
                schedule.append((game_code, y, m, d, year, away_team, home_team))

        self.engine.insert_scheduled_games(schedule)
        self.engine.commit_changes()
        # return schedule

DataCollector().get_season_schedule('2017')
