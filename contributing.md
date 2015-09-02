
# How to Contribute

This document serves to bring new developers up-to-speed on the project.

## Technical Dependencies

This project requires that Redis, MongoDB and Node.js (along with NPM)
are installed.

 - http://nodejs.org
 - http://redis.io/download
 - http://www.mongodb.org/downloads

You will also need to run `npm install` from the project root to install
application-specific Node dependencies.

## How to Run the application

Running it is easy - make sure your `mongod` and `redis-server` processes are
running, then `npm run dev` from the project root. Also, make sure to have an
unstaged `.env` file with your chosen environment variables.

## I work on Windows, I can't install the required version of Redis!

Install [Vagrant](https://www.vagrantup.com) along with a VM like
[VirtualBox](https://www.virtualbox.org/).

Unfortunately, since Windows can't support symlinks on a host VM, you'll need
to run these commands in this order:

```
$ npm install && vagrant up && vagrant ssh
```

Then, start the application once logged in to SSH by running:

```
$ cd /vagrant && npm run dev
```

If the `npm run dev` command does not work, then you might have to do this:

```
$ npm i -g nodemon babel bunyan
$ nodemon --exec babel-node --stage 0 -- lib/index.js | bunyan
```

Vagrant will sync your local project files with the ones on the Machine, and
Nodemon will handle re-compiling the application when files change. This might
take a few minutes, though.

## Accessing the application

Vagrant will forward ports, so whether connecting from Vagrant or not you should
be able to access the app on `localhost:5000` - there are two routes;
`/api/install` and `/api/announce`.

## Git branch strategy

Please branch off of `develop`. That is all, thank you.
