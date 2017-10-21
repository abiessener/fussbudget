# Fussbudget

Fussbudget is a lightweight scheduling webapp that helps caregivers stay on top of the daily schedules of their charges and adapts to the unique challenges each day presents. Fussbudget builds out a schedule based on accepted general principles and gives caregivers the ability to modify it manually, as well as dynamically adapting to different wake-up times.

## Deployed
Interact with a fully deployed and functional version of [Fussbudget on the web] (https://fussbudget.herokuapp.com).

## Built With

MEAN Stack
* MongoDB
* Express
* AngularJS
* Node.js

Angular Material
Filestack

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [npm] (https://www.npmjs.com)

### Installing

1. Clone this repo down to your local machine.
2. `npm install`
3. Modify db.config.js to point to a valid MongoDB instance.
4. Launch server.js (I suggest `nodemon` myself, but your IDE's debugger or just `node server/server.js` or `npm start` from a command shell is fine)

### Completed Features

- [x] Manage multiple clients and interact with their schedules
- [x] Automatically adjust schedule for different wakeup time
- [x] Angular Material UI

### Next Steps

Features that I would like to add at some point in the future.

- [ ] Invite people to become 'secondary' caregivers via email (nodemailer)
- [ ] Generate day-end reports of interactions with a client's schedule, display in-app, and optionally email to primary and/or secondary caregivers
- [ ] Deploy as captive webview Android app

## Deployment

Should be pretty straightforward to deploy to whatever Node environment you like. Just make sure you're connected to a MongoDB.

## Author

* Adam Biessener

## Acknowledgments

* Thanks to my excellent classmates and instructors at Prime Digital Academy for all their advice, answers, and encouragement throughout the development process!

## Icons
Favicon, default user avatar, and default client avatar made by Freepik from www.flaticon.com.

## Copyright
All code (c) Adam Biessener
