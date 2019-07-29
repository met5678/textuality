const { execSync } = require('child_process');
const path = require('path');

const adminDir = path.join(__dirname, '../admin-app');
const rootDir = path.join(__dirname, '../');

execSync(
  'mongodump --host ds217699-a0.mlab.com:17699 -d rupaul-bracket -u rupaul-db-prod-to-dev -p Xt53idEgcrm@ --excludeCollection meteor_accounts_loginServiceConfiguration --excludeCollection meteor_oauth_pendingCredentials --excludeCollection objectlabs-system',
  { cwd: rootDir }
);
execSync(
  'mongorestore -h localhost:3001 -d meteor ../dump/rupaul-bracket/ --drop',
  { cwd: adminDir }
);
execSync('rm -rf dump', { cwd: rootDir });
/*
mongodump --host ds217699-a0.mlab.com:17699 -d rupaul-bracket -u rupaul-db-prod-to-dev -p Xt53idEgcrm@ --excludeCollection meteor_accounts_loginServiceConfiguration --excludeCollection meteor_oauth_pendingCredentials --excludeCollection objectlabs-system
*/

/*
mongorestore -h localhost:3001 -d meteor ../dump/rupaul-bracket/ --drop
*/
