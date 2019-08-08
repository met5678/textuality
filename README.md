# Textuality

Textuality is an application that allows players to text in to a phone number, and have their text show up on a public screen. It also does a hell of a lot more (images, achievements, badges, automatic texts, moderation).

Textuality is set up as two Meteor applications: an admin app for setting up the automated texts and monitoring the texts that come in, and a client app for showing the public screens.

## Setup / Running Locally

### Install Dependencies

1. Install [Node](http://nodejs.org/)
2. Install Meteor: `curl https://install.meteor.com/ | sh`

### Run Meteor Apps

Textuality consists of an admin app and a client app. They are located in the `textuality-admin` and `textuality-client` directories. You have the option of running them individually, but it's easiest just to run them using the following command:

```bash
npm start
```

This will start the admin at `http://localhost:5000` and the client at `http://localhost:5002`. You may want to restart this command whenever you pull new code from github.

### Configuring Credentials

Both `twilio`, used for the texting, and `cloudinary`, used for the image storage, require API credentials to work. For security reasons, those API credentials are not present in this repository. You must create a `settings.json` file at the root of this repo with the following format:

```json
{
  "public": {
    "cloudinaryCloudName": "xxxxxxxxx"
  },

  "private": {
    "twilioSid": "xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "twilioToken": "xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "cloudinaryKey": "xxxxxxxxxxxxxxxxxxxx",
    "cloudinarySecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  }
}
```

Ask Roo for the credentials.

### Configuring Twilio for local development

Textuality requires [Twilio](https://www.twilio.com/) to receive texts. Twilio needs a publicly-visible endpoint to post the texts to. When Textuality is running in production, this should be set to the Galaxy URL (see `Deploy` section below). In development, if two people are developing at once, you can't both be testing with the same phone number. Either purchase a new number or warn the other person you're gonna kick them off temporarily.

1. Install ngrok(https://ngrok.com/download). You'll have to create an account and follow the instructions there.
2. Move the `ngrok` executable to the `bin` folder in this repo.
3. Test that it works by running `npm run open-tunnel`.
4. Copy the forwarding url to your clipboard. For example: `https://d9a11bf7.ngrok.io`
5. Goto the `Phone Numbers -> Manage Numbers` section of the Twilio admin. https://www.twilio.com/console/phone-numbers/incoming
6. Click on the phone number that you want to use.
7. Scroll down to the `Messaging` section, and under `A Message Comes In`, select Webhook.
8. Paste the URL from step 4 into the textbox, and add `/text-handler` to the end. For example: `https://d9a11bf7.ngrok.io/text-handler`. You can leave dropdown set to `HTTP POST`.
9. Hit `Save`. You're done!

## Deploying

Coming soon...

## Folder Structure

Just a quick run through of the folder structure of this app.

### Deprecated stuff

The following folders are no longer in use in this new branch, but I'm not deleting them yet so I can easily reference them.

- `textuality-app`
- `textuality-deploy`
- `textuality-tester`

### Top Level Folders

- `textuality-admin`: The Admin app for textuality, runs at `localhost:5000` in dev.
- `textuality-client`: The Client app for textuality, runs at `localhost:5002` in dev.
- `scripts`: Contains convenience scripts, like `npm run open-tunnel`
- `bin`: Contains executables, currently just `ngrok`.

### Meteor App Structure

Within each meteor app, the structure is as follows:

- `.meteor`: Meteor versioning stuff, generally don't touch.
- `client`: Code that runs on the browser only. Boilerplate stuff, except for `main.scss` which is where we put all of our styles.
- `imports`: This is where all the juicy bits go, broken down below.
- `public`: Static content mostly, such as images (not including user submissions), videos, fonts, etc.
- `server`: Code that runs from the server only.
- `tests`: One day I'll bother with tests. Not today, Satan.

#### The `imports` folder

This is where basically everything lives. I use this folder instead of the `client` and `server` folders because this allows me to use npm's `import` statements to determine what gets sent to the client. Just a better development practice, Meteor devs also recommend it.

- `api`: Where all of the collections live. All of the subfolders here are for the various collections, one for each. This folder is shared between the admin and client apps (the client app symlinks it to the admin app).
- `schemas`: The schemas for the collections. Broken out because it's useful to have these all easily accessible. Shared between the admin and client apps, symlinked from client.
- `services`: Connections to external services, such as Twilio and Cloudinary. Functional exports. Shared between the admin and client apps, symlinked from client.
- `startup`: Code that runs when the app starts. Mostly initialization stuff.
- `ui`: All of the react components in the whole app, basically the front end. Broken down further below.
- `utils`: Little utility functions that prove useful across the app. Pure functions. Shared between the admin and client apps, symlinked from client.

#### The `imports/api` folder

Within each collection, the file structure is nearly idenctical:

- `[name]/[name].js`: Where the collection is initialized
- `[name]/helpers.js`: All of the helpers (aka computed properties) for this collection.
- `[name]/methods.js`: All of the server methods for this collection. Generally add/update/delete methods, plus some special cases. Mostly used by the admin app.
- `[name]/server/publications-admin.js`: The publications used by the admin app.
- `[name]/server/publications-client.js`: The publications used by the client app.

#### The `imports/ui` folder

The UI folder is broken down as follows:

- `generic`: Generic components, like buttons, tables, and form inputs. Nothing domain-specific allowed. Highly reusable.
- `modules`: Catch-all for modules that appear in the app. Domain-specific, broken down by domain subfolders.
- `pages`: Top-level pages on the app. Subscriptions are typically managed here.
- `App.jsx`: The React entry point for the app.
- `Shell.jsx`: The wrapper html for the app.
