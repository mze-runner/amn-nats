import { Message } from 'node-nats-streaming';
export { natsClient } from './client';
import { Publisher } from './publisher';
import { Listener } from './listener';

export default { Publisher, Listener, Message };
export { Publisher, Listener, Message };
