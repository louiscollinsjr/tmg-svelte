import mongoose, { Model, Schema } from 'mongoose';

const userInteractionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    type: {
        type: String,
        enum: ['save', 'like', 'view'],
        required: true
    },
    targetModel: {
        type: String,
        enum: ['Professional', 'Project', 'Review'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export interface UserInteractionDocument extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    targetId: mongoose.Types.ObjectId;
    type: 'save' | 'like' | 'view';
    targetModel: 'Professional' | 'Project' | 'Review';
    createdAt: Date;
    updatedAt: Date;
}

let UserInteraction: Model<UserInteractionDocument>;

export function getUserInteractionModel(): Model<UserInteractionDocument> {
    if (!UserInteraction) {
        UserInteraction = mongoose.models.UserInteraction || 
            mongoose.model<UserInteractionDocument>('UserInteraction', userInteractionSchema);
    }
    return UserInteraction;
}
