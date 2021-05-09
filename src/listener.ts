import { Message, Stan } from 'node-nats-streaming';
import { Logger } from './logger';

interface Event {
    subject: string;
    payload: any;
}

export abstract class Listener<T extends Event> extends Logger {
    abstract subject: T['subject'];
    abstract queueGroupName: string;
    abstract onMessage(payload: T['payload'], msg: Message): void;
    private client: Stan;
    protected ackWait = 5 * 1000;

    constructor(client: Stan, logger?: Function) {
        super(logger);
        this.client = client;
    }

    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName);
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );

        subscription.on('message', (msg: Message) => {
            this.log(
                `Message received: ${this.subject} / ${this.queueGroupName}`
            );

            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        });
        this.log(
            `Listener for ${this.subject} / ${this.queueGroupName} is up!`
        );
    }

    parseMessage(msg: Message) {
        const payload = msg.getData();
        return typeof payload === 'string'
            ? JSON.parse(payload)
            : JSON.parse(payload.toString('utf8'));
    }
}
