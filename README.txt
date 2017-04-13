In order to build and run this project on a computer, here are the technologies you will need, as well as installation instructions:

On the whole, this project was designed and run on a Mac, but the technologies in use are all widespread and should be platform independent. The instructions I will give are all going to be in terms of execution in a Unix shell, particularly the default shell used by the Mac Terminal app.

For the website front end:
 - The front end is managed using Node.js. I have Node version 7.5.0 installed on my laptop, but in theory the version should not matter much for this project.
 - It can be downloaded at: https://nodejs.org/en/download/.
 - From there, in Terminal, go to the directory for this project, and enter: 
	cd frontend
	npm install
	node server.js
 - That should be adequate to serve the front end, it should then say that the app is listening on localhost:3000. Leave this window running and open a new one.

For the website back end:
 - The back end is written in Python 2.7. This is the default version available on a Mac, so I will assume this is already available on your computer.
 - In order to run, the application needs 4 modules beyond the default ones to be installed via pip. If pip is not already installed on your machine, follow the steps in this guide to install it: https://packaging.python.org/installing/
 - I would recommend using virtualenv for this task, which can be installed in Terminal using pip and configured as follows:
	pip install virtualenv
	cd backend
	virtualenv env
	source activate env
 - From there, your python modules will only be installed locally in that virtual environment. The rest of the application can be installed and run with the following commands:
	pip install -r requirements.txt
	python server.py
 - Please note that the connection details for my MySQL connection are hardcoded at the top of the backend/server.py script, and should be changed accordingly to fit your MySQL configuration. 
 - The 

Assuming the database has been loaded from the nba_stats.sql file that is part of this project, the application should then be fully functional. The website can be accessed by going to localhost:3000 in a browser. 

Note: This website was developed specifically for Chrome and there may be CSS that works for Chrome but not other browsers. If you are not using a laptop or an Apple mouse with finger scrolling capabilities, you may want to remove the entire <style> tag in index.html, as it removes built in html scroll bars. There are several parts of the page (menus, etc) that rely on scrolling capabilities, but look better when these scroll bars are disabled, hence it currently relies on laptop-style finger scrolling. 
