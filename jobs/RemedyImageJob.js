import BaseJob from './BaseJob.js';
import { generateAiImgs } from '../utils/generateAiMetadata.js';
import { uploadImageFromUrl } from '../utils/uploadImageToCloudinary.js';
import Remedy from '../models/remedy.model.js';

export default class RemedyImageJob extends BaseJob {
    constructor(isWorker = false) {
        super('remedy_image_queue', isWorker);
    }

    async handle(data) {
        // console.log('🖼 I am running a job with data:', data);
        // const remedy = Remedy.findOne({ slug: data.slug })
        // console.log(remedy)
        // console.log(data,"darta")
        // Your job logic here (e.g., image processing)
        // const filePath = await generateAiImgs(data.description);
        // const media = await uploadImageFromUrl(filePath);

        // Remedy.updateOne({
        //     id: remedy._id,
        // },{
        //     media
        // })
    }
}