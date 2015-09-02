# `passmarked-slack`

This is the repo for [Passmarked's](http://passmarked.com) hosted Slack bot.

The code in here powers a server that maintains a queue of bots, all interacting
with different teams via different API tokens through both the Slack RTM and
web APIs.

The tokens are persisted to a document-oriented database called MongoDB.

Redis is used as a caching layer, as well as a persistent store for maintaining
job queues. There are two job queues - the first deals with long-lived processes
(keeping the bots online and chatting) and the other deals with cleaning invalid
tokens from the database every 6 hours.

## Installation

Installing `passmarked-slack` requires a number of things. The first thing is
[Redis >= 2.8.11](http://redis.io/download). The second thing is
[MongoDB](https://www.mongodb.org/downloads).

You will also need to have some environment variables set. Take a look at the
[example `.env` file](.env-example) to see which ones you need - you can also
remove the `-example` suffix and the application will use the variables defined
there.

## Contributing

If you wish to improve this project, are have become a maintainer, please read
the [contribution guidelines](contributing.md)

## License

```
Copyright 2015 Passmarked Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
