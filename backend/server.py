from time import sleep
from flask import Flask, Response

from backend.db_engine import Engine

app = Flask(__name__)

WORKERS = 5
SLEEP_TIME = 0.05

# TODO: EVALUATE WHETHER THIS IS ACTUALLY ASYNCHRONOUS / ALLOWS MULTITHREADING

available_engines = [Engine() for _ in range(WORKERS)]


# methods for helping to manage the

def get_next_engine():
    """ Get the next available worker in the form of a free engine object """
    while len(available_engines) == 0:
        sleep(SLEEP_TIME)
    return available_engines.pop(0)


def release_engine(engine):
    """ Allow the worker engine to return to the queue to await usage """
    available_engines.append(engine)

# Here begins the routing and corresponding calls


@app.route('/scheduleforseason=<season>')
def get_schedule(season):
    """ send the league's schedule for a season to front end """
    engine = get_next_engine()
    engine_response = engine.get_league_schedule_for_season(season)
    resp = Response(engine_response)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Headers'] = '*'
    release_engine(engine)
    return resp


@app.route('/teamsforseason=<season>')
def teams_in_league(season):
    """ send list of teams competing in league in given season to front end """
    engine = get_next_engine()
    response = engine.get_teams_in_league(season)
    release_engine(engine)
    return response


if __name__ == '__main__':
    app.debug = True
    app.run()
