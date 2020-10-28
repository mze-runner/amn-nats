import { Stan } from 'node-nats-streaming';
import { Logger } from './logger';

interface Event {
    subject: string; // Subjects;
    payload: any;
}

export abstract class Publisher<T extends Event> extends Logger {
    abstract subject: T['subject'];
    private client: Stan;

    constructor(client: Stan, logger?: any) {
        super(logger);
        this.client = client;
    }

    publish(payload: T['payload']): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.publish(
                this.subject,
                JSON.stringify(payload),
                (err) => {
                    if (err) {
                        this.log(
                            `Publisher error. Subject: '${this.subject}', error: ${err.message}`
                        );
                        return reject(err);
                    }
                    this.log(`Event published to subject ${this.subject}`);
                    resolve();
                }
            );
        });
    }
}
