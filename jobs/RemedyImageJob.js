import BaseJob from './BaseJob.js';
import { generateAiImgs } from '../utils/generateAiMetadata.js';
import { uploadImageFromUrl } from '../utils/uploadImageToCloudinary.js';
import Remedy from '../models/remedy.model.js';
import mongoose from 'mongoose'; // Ensure Mongoose is imported

export default class RemedyImageJob extends BaseJob {
    constructor(isWorker = false) {
        super('remedy_image_queue', isWorker);
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
            let media;

                // Fetch the remedy document within the transaction
                remedy = await Remedy.findOne({ slug: data.remedySlug });
                if (!remedy) {
                    throw new Error(`No remedy found with slug: ${data.remedySlug}`);
                }

                // Generate AI image (outside DB transaction scope, as it's external)
                const filePath = await generateAiImgs(data.description);

                // Upload image to Cloudinary (outside DB transaction scope)
                media = await uploadImageFromUrl(filePath);

                // Update the remedy document within the transaction
                const updateResult = await Remedy.updateOne(
                    { _id: remedy._id },
                    { $set: { media } },
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