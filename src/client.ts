// TODO: implement initialization of NATS client!
import nats, { Stan } from 'node-nats-streaming';

class NatsClient {
    private _client?: Stan;

    get client() {
        if (!this._client) {
            throw new Error('Cannot access NATS client before connecting');
        }

        return this._client;
    }

    connect(
        clusterId: string,
        clientId: string,
        url: string,
        logger?: Function,
        loggerError?: Function
    ) {
        this._client = nats.connect(clusterId, clientId, { url });

        return new Promise((resolve, reject) => {
            this.client.on('connect', () => {
                logger && logger(`Connected to NATS cluster ${clusterId}`);
                resolve(this.client);
            });
            this.client.on('error', (err) => {
                loggerError && loggerError('Error connection to NATS');
                loggerError && loggerError(JSON.stringify(err));
                reject(err);
            });
        });
    }
}

export const amnNATS = new NatsClient();
