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

This will start the admin at `http://localhost:3000` and the client at `http://localhost:3002`. You may want to restart this command whenever you pull new code from github.

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
