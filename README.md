Textuality
==========

Setup / Running Locally
-----------------------
1. Install node
2. Install Meteor

```bash
cd textuality-app
meteor
```


Copying down prod DB to local
-----------------------------
First, ensure meteor is running. Next, run this:

```sh
./textuality-app/copyProdDB.sh
```

Deploying local build to production
-----------------------------------

```bash
cd textuality-deploy
mup deploy
```