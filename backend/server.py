import json
from time import sleep
from flask import Flask, Response, abort, request

from backend.db_engine import Engine
from backend.data_processing import DataProcessor

app = Flask(__name__)

WORKERS = 5
SLEEP_TIME = 0.05

# TODO: EVALUATE WHETHER THIS IS ACTUALLY ASYNCHRONOUS / ALLOWS MULTITHREADING

available_engines = [Engine() for _ in range(WORKERS)]
processor = DataProcessor()


# methods for helping to manage the connections to the dbms
def get_next_engine():
    """ Get the next available worker in the form of a free engine object """
    while len(available_engines) == 0:
        sleep(SLEEP_TIME)
    return available_engines.pop(0)


def release_engine(engine):
    """ Allow the worker engine to return to the queue to await usage """
    available_engines.append(engine)

# Here begins the routing and corresponding calls


@app.route('/scheduleforseason=<int:season>')
def get_schedule(season):
    """ send the league's schedule for a season to front end """
    # validation: converter <int:x> forces all values to ints, rejects otherwise
    # season must be a 4-character year, i.e. 2017
    if not 2000 < season < 2020:
        abort(400)
    engine = get_next_engine()
    engine_response = engine.get_league_schedule_for_season(season)
    resp = Response(engine_response)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Headers'] = '*'
    release_engine(engine)
    return resp


@app.route('/get_simulation/away=<int:away_id>&home=<int:home_id>')
def make_simulation_for_teams(away_id, home_id):
    # validation: converter <int:x> forces all values to ints, rejects otherwise
    # processor will raise ValueError if not a valid row id
    try:
        sim = processor.generate_simulation(away_id, home_id)
    except ValueError:
        abort(400)

    resp = Response(sim)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Headers'] = '*'
    return resp


@app.route('/savesimulation', methods=['POST'])
def save_simulation():
    sim_data = json.loads(request.data)
    name_valid = all(char.isalnum() for char in sim_data['save_name'])
    shallow_box_valid = 'away' in sim_data['box_score'] and 'home' in sim_data['box_score']
    team_ids_valid = type(sim_data['away_tm_id']) == int and type(sim_data['home_tm_id']) == int

    created_id = -1
    if name_valid and shallow_box_valid and team_ids_valid:
        engine = get_next_engine()
        try:
            created_id = engine.save_simulation(sim_data)
            release_engine(engine)
        except Exception as e:
            abort(400)
    else:
        abort(400)

    return json.dumps({'id': created_id}), 201


@app.route('/get_saved_simulations')
def get_saved_simulations():
    engine = get_next_engine()
    sim_list = engine.fetch_saved_simulations()
    release_engine(engine)
    return json.dumps(sim_list)


@app.route('/delete_saved_simulation=<int:sim_id>', methods=['DELETE'])
def delete_saved_simulation(sim_id):
    # validate by casting to int. invalid id number will also raise error
    try:
        engine = get_next_engine()
        engine.delete_simulation(sim_id)
        release_engine(engine)
    except TypeError, Exception:
        abort(404)

    return '{}', 200


@app.route('/teamsforseason=<int:season>')
def teams_in_league(season):
    """ send list of teams competing in league in given season to front end """
    engine = get_next_engine()
    response = engine.get_teams_in_league(season)
    release_engine(engine)
    return json.dumps(response), 200


@app.route('/seasonstatoverview/season=<int:season>&team=<string:team>')
def get_season_overview(season, team):
    # validate that team must be a 3-character string (the abbreviation)
    if len(team) != 3:
        abort(400)

    games = []
    try:
        engine = get_next_engine()
        games = engine.get_season_stat_overview(season, team)
        release_engine(engine)
    except ValueError:
        abort(400)

    return json.dumps(games)


@app.route('/gameinformation=<string:gameid>')
def get_game_info(gameid):
    """ 
        get all information about a given game based on a given id
    """
    # validate first: gameid must be a 12 digit string, 9 digits to begin and 3 characters after
    valid_chars = all(char.isdigit() for char in gameid[:9]) and all(char.isalpha() for char in gameid[9:12])
    if not (len(gameid) == 12 and valid_chars):
        abort(400)

    engine = get_next_engine()
    engine_response = engine.get_game_data(gameid)
    resp = Response(engine_response)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Headers'] = '*'
    release_engine(engine)
    return engine_response


if __name__ == '__main__':
    app.debug = True
    app.run()
