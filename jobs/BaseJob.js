import Queue from 'bull';

export default class BaseJob {
    constructor(name, isWorker = false) {
        this.queue = new Queue(name, {
            redis: { host: '127.0.0.1', port: 6379 }
        });

        // Only bind process handler if running as a worker
        if (isWorker) {
            this.queue.process(async (job) => {
                if (typeof this.handle !== 'function') {
                    throw new Error(`Job ${name} is missing a handle() method`);
                }
                return await this.handle(job.data);
            });

            // Log events
            this.queue.on('completed', (job) => {
                console.log(`✅ [${name}] Job completed:`, job.data);
            });
            this.queue.on('failed', (job, err) => {
                console.error(`❌ [${name}] Job failed:`, job.data, err.message);
            });
        }
    }

    static dispatch(data) {
        return this.instance.queue.add(data);
    }

    static schedule(cron, data) {
        return this.instance.queue.add(data, { repeat: { cron } });
    }

    static get instance() {
        if (!this._instance) {
            // Pass isWorker=true only when initializing in worker context
            this._instance = new this(process.env.IS_WORKER === 'true');
        }
        return this._instance;
    }
}