import RemedyImageJob from './jobs/RemedyImageJob.js'; // Import image job class
import RemedyTitleJob from './jobs/RemedyTitleJob.js'; // Import title job class

console.log('Worker started, listening for jobs...');

// Map of job classes to their queues
const jobConfigurations = [
    { name: 'RemedyImageJob', jobClass: RemedyImageJob, queue: RemedyImageJob.instance.queue },
    { name: 'RemedyTitleJob', jobClass: RemedyTitleJob, queue: RemedyTitleJob.instance.queue },
];

async function startWorker() {
    // Iterate over all job configurations to initialize and set up processing
    for (const { name, jobClass, queue } of jobConfigurations) {
        // Check if the queue is initialized
        if (!queue.clientInitialized) {
            throw new Error(`Queue client for ${name} is not initialized. Check Redis connection.`);
        }

        console.log(`Connected to Redis for ${name}, ready to process jobs`);
    }
}

startWorker().catch((err) => {
    console.error('Failed to start worker:', err);
    process.exit(1); // Exit with error code if initialization fails
});