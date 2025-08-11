import BaseJob from './BaseJob.js';
import { generateAiImgs } from '../utils/generateAiMetadata.js';
import { uploadImageFromUrl } from '../utils/uploadImageToCloudinary.js';
import Remedy from '../models/remedy.model.js';

export default class RemedyImageJob extends BaseJob {
    constructor(isWorker = false) {
        super('remedy_image_queue', isWorker);
    }

    async handle(data) {
        try {
            console.log('🖼 Generating image for remedy:', data);

            // Extract needed fields
            const { remedyId, description } = data;

            // Step 1: Generate image URL/path from AI
            const imageUrl = await generateAiImgs(description);
          console.log(imageUrl,"imgjo")
            // Step 2: Upload image to Cloudinary
            const media = await uploadImageFromUrl(imageUrl);
          
            console.log(media,"media")
            
            // Step 3: Update the remedy record in DB
            await Remedy.updateOne(
                { id: remedyId }, // Ensure this matches your schema's ID field
                { $set: { media } }
            );

            console.log(`✅ Remedy ${remedyId} updated with new media`);
        } catch (error) {
            console.error('❌ Error in RemedyImageJob:', error);
        }
    }
}
