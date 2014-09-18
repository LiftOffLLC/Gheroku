echo "Input parameters $1 $2 $3 $4 $5"
rm -rf ./hrk
mkdir hrk
cd hrk/
git init
git remote add heroku git@heroku.com:$4.git
git pull heroku master
git rm -rf .
git commit -am "pre commit delete"
echo "Did a pre-commit to Heroku"

cd ..
rm -rf ./ghub
mkdir ghub
cd ghub
git init

git remote add origin git@github.com:$1/$3.git
git pull origin $2
echo "Fetched code from configured deploy branch"


cd ../hrk
echo "$5"
if [ -z "$5" ]; then
  rsync -r --links --exclude=.git/* ../ghub/ .
  echo "Single app file"
else
  rsync -r --links --exclude=.git/* ../ghub/$5/ .
  echo "Sub projects found"
fi

git add .
git commit -am "merged with github"

echo "Pushing to Heroku"
git push heroku master

cd ..
rm -rf ./ghub
rm -rf ./hrk
echo "Cleaned up tmp folders, latest build is on Heroku"