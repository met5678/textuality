Textuality
==========

Setup / Running Locally
-----------------------
One time setup:

1. Install [Node](http://nodejs.org/)
2. Install Meteor: `curl https://install.meteor.com/ | sh`

Run at http://localhost:3000:
```bash
cd textuality-app
meteor
```

Copying down prod DB to local
-----------------------------
First, ensure meteor is running. Next, run this:

```bash
./textuality-app/copyProdDB.sh
```

Deploying local build to production
-----------------------------------
Deploys to http://ec2-54-175-160-234.compute-1.amazonaws.com/

```bash
cd textuality-deploy
mup deploy
```