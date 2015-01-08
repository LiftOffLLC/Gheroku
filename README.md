# About Gheroku #

Ruby based web application to auto-deploy code to Heroku whenever any code is pushed to a "Specified" branch. Currently, Github is the supported versioning system.

# Setting up the box for Gheroku #

1. Generate SSH Keys - so we can add to get Read Access to Repo
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
 * Set heroku api key as environment variable 
 		> Add: export HEROKU_API_KEY="<your heroku api key>"
 		> Run: . .bashrc

4. Set up Mandrill for status report emails.
 * Create an account on mandrill.com
 * Set mandrill api key as environment variable
 		> Add: export MANDRILL_API_KEY="<your mandrill api key>"
 		> Run: . .bashrc

5. For single project apps where the rest-api and web layer reside on the same heroku application, any code pushed to "launch" branch would trigger a build on Heroku.

6. For projects which contain sub-projects, the branch can be configured. In the folder name field, key in the folder name the way it is in the code. Also specify the corresponding branch name and the heroku app to which you want your code to be deployed.

7. Memcache is needed for the app to store data. Install memcache and add an entry to your etc/hosts file specifying the url it is running on. It generally is 127.0.0.1 if its running on the same machine as the app.

#Running the application#

After your have cloned Gheroku, You can run the app (it's based on Sinatra) using, if you don't have Sinatra in loccal Gemlist, might have to do "bundle install":

ruby server.rb

# License #

Gheroku is licensed under the MIT license: <http://opensource.org/licenses/mit-license.php>