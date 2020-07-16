import { Message } from 'node-nats-streaming';
import { natsClient } from './client';
import { Publisher } from './publisher';
import { Listener } from './listener';

// export default { Publisher, Listener, Message, natsClient as client};
export { Publisher, Listener, Message, natsClient as client };
