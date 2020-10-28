export abstract class Logger {
    #logger: any;
    constructor(logger: any) {
        this.#logger = !logger ? undefined : logger;
    }

    protected log(message: string) {
        if (this.#logger) {
            this.#logger(message);
        }
    }
}
