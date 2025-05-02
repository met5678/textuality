
mv public public-local
DEPLOY_HOSTNAME=galaxy.meteor.com meteor deploy textuality.meteorapp.com --settings ../settings.json
mv public-local public
