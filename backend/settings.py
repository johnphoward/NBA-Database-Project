from datetime import date

FIRST_YEAR = 2006

this_date = date.today()
CURRENT_SEASON = this_date.year + int(this_date.month > 9)
SEASON_LIST = range(FIRST_YEAR, CURRENT_SEASON + 1)
