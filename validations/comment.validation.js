import Joi from 'joi';
import mongoose from 'mongoose';

const objectIdValidator = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message(`${value} is not a valid ObjectId`);
    }
    return value;
};

const createCommentValidation = Joi.object({
    content: Joi.string().trim().max(1000).required(),
    remedyId: Joi.string().custom(objectIdValidator).required(),
    parentCommentId: Joi.string().custom(objectIdValidator).allow(null, '').optional()
});

const moderateCommentValidation = Joi.object({
    status: Joi.string().valid('approved', 'rejected').required()
});



export {
    createCommentValidation,
    moderateCommentValidation
}