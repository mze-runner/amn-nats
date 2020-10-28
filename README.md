# AMN NATS Streaming

Provides Publisher and Listener classes to work with NATS Streaming.

### Listener

Javascript example

Define a `Listener` class;

```javascript
const { Listener } = require('amn-nats');

const SUBJECT = 'listener:example';
const QUEUE = 'example-queue';

class ExampleListener extends Listener {
    subject = SUBJECT;
    queueGroupName = QUEUE;
    async onMessage(payload, msg) {
        try {
            console.log('Subject: ' + this.subject);
            console.log('Payload: ' + this.payload);
            // code to handle the payload
            // ...
            // ...

            // ensure we acknowledge message
            msg.ack();
        } catch (err) {
            // log error!
        }
    }
}

module.export = { ExampleListener };
```

Instantiate a `Listener` class.

```javascript
const { natsClient } = require('./client');
const { ReplayTitleAllListener } = require('./events/listener');

new ExampleListener(natsClient.client).listen();
```

### Publisher

Javascript example

Define a `Publisher` class;

```javascript
const { Publisher } = require('amn-nats');
const SUBJECT = 'listener:example';

class ExamplePublisher extends Publisher {
    subject: SUBJECT;
}

module.export = { ExamplePublisher };
```

Instantiate a `Publisher` class;

```javascript
const { natsClient } = require('./client');
const { ExamplePublisher } = require('./file_with_publisher');

// natsClient is an active Stan connection NATS server

const examplePayload = {
    id: '1234567890',
    message: 'This is a example publisher',
};

new ExamplePublisher(natsClient).publish(examplePayload);
// or
await new ExamplePublisher(natsClient).publish(examplePayload);
```

### NATS Connection class

Example of NATS client class. The call of `connect` method have to be done on at server initialization.

```javascript
const nats = require('node-nats-streaming');

class NatsClient {
    constructor() {
        this._client = undefined;
    }
    get client() {
        if (!this._client) {
            throw new Error('Cannot access NATS client before connecting');
        }
        return this._client;
    }

    connect(clusterId, clientId, url) {
        this._client = nats.connect(clusterId, clientId, { url });

        return new Promise((resolve, reject) => {
            this.client.on('connect', () => {
                resolve();
            });
            this.client.on('error', (err) => {
                reject(err);
            });
        });
    }
}

module.exports.natsClient = new NatsClient();
```
