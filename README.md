# What is it #

A simple application to auto-deploy code to Heroku whenever any code is pushed to a "Specified" branch. Currently, Github is the supported versioning system.

# Installation #

1. Generate SSH Keys:-
 * cd ~/.ssh
 * ssh-keygen -t rsa -C "your_email@example.com"
 * ssh-add ~/.ssh/id_rsa

2. Provide git read access to the app
 * sudo apt-get install xclip
 * xclip -sel clip < ~/.ssh/id_rsa.pub
 * Now the public key is copied. At Github, there exists an option called Deploy-Keys which can be found under Project level settings.
 * Adding these key to that would give this app read-acess to the repo.

3. Provide Heroku access to the app.
 * Create an account on heroku.com
 * Install Heroku toolkit: wget -qO- https://toolbelt.heroku.com/install-ubuntu.sh | sh
 * heroku login(prompts for email and password, taken from the account)
 * Add this email as a collaborator on Heroku.

4. For single project apps where the rest-api and web layer reside on the same heroku application, any code pushed to "launch" branch would trigger a build on Heroku.

5. For projects which contain sub-projects, the branch can be configured. In the folder name field, key in the folder name the way it is in the code. Also specify the corresponding branch name and the heroku app to which you want your code to be deployed.

6. Memcache is needed for the app to store data. Install memcache and add an entry to your etc/hosts file specifying the url it is running on. It generally is 127.0.0.1 if its running on the same machine as the app.

#Running the application#

Running a Sinatra app is as easy as:

ruby server.rb

# License #

Gheroku is licensed under the MIT license: <http://opensource.org/licenses/mit-license.php>