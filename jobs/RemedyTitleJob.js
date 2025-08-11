import BaseJob from './BaseJob.js';
import { generateTitle } from '../utils/generateAiMetadata.js';
import Remedy from '../models/remedy.model.js';
import mongoose from 'mongoose';
import slugify from '../utils/slugify.js';

export default class RemedyTitleJob extends BaseJob {
    constructor(isWorker = false) {
        super('remedy_title_job', isWorker);
    }

       async handle(data) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();


            // Check MongoDB connection state
            if (mongoose.connection.readyState !== 1) {
                throw new Error('MongoDB connection not ready');
            }

            let remedy;

                // Fetch the remedy document within the transaction
                remedy = await Remedy.findOne({ slug: data.remedySlug });
                if (!remedy) {
                    throw new Error(`No remedy found with slug: ${data.remedySlug}`);
                }

                // Generate AI image (outside DB transaction scope, as it's external)
                const title = await generateTitle(data.description);

                // Update the remedy document within the transaction
                const updateResult = await Remedy.updateOne(
                    { _id: remedy._id },
                    { $set: { name: title, slug: slugify(title) } },
                    { session }
                );

                if (updateResult.matchedCount === 0) {
                    throw new Error(`No document matched for update with _id: ${remedy._id}`);
                }

                await session.commitTransaction()
                session.endSession()
        } catch (err) {
            await session.abortTransaction()
            console.error('Error processing image job:', err);
            throw err; // Let Bull handle the failure
        } finally {
            session.endSession();
        }
    }
}
