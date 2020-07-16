import { Stan } from 'node-nats-streaming';
// import { Subjects } from './subjects';

interface Event {
    subject: string; // Subjects;
    payload: any;
}

export abstract class Publisher<T extends Event> {
    abstract subject: T['subject'];
    private client: Stan;

    constructor(client: Stan) {
        this.client = client;
    }

    publish(payload: T['payload']): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.publish(
                this.subject,
                JSON.stringify(payload),
                (err) => {
                    if (err) {
                        return reject(err);
                    }
                    console.log('Event published to subject', this.subject);
                    resolve();
                }
            );
        });
    }
}
