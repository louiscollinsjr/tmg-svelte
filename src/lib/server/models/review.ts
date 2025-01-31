import mongoose, { Model, Schema } from 'mongoose';

const reviewSchema = new Schema({
    contractor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: String,
    content: String,
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'published'
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

export interface ReviewDocument extends mongoose.Document {
    contractor: mongoose.Types.ObjectId;
    client: mongoose.Types.ObjectId;
    created_by: mongoose.Types.ObjectId;
	owner: mongoose.Types.ObjectId;
    project?: mongoose.Types.ObjectId;
    rating: number;
    title?: string;
    content?: string;
    status: 'draft' | 'published' | 'archived';
    createdAt: Date;
    updatedAt: Date;
}

let Review: Model<ReviewDocument>;

export function getReviewModel(): Model<ReviewDocument> {
    if (!Review) {
        Review = mongoose.models.Review || mongoose.model<ReviewDocument>('Review', reviewSchema);
    }
    return Review;
}
