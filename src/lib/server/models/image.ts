import { Schema, model, type Model } from 'mongoose';
import type { UserDocument } from './user';

interface ImageDocument {
    url: string;
    filename: string;
    contentType: string;
    uploadedBy: UserDocument;
    timestamp: Date;
    createdAt: Date;
    updatedAt: Date;
}

const imageSchema = new Schema({
    url: { type: String, required: true },
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now },
}, {
    timestamps: true
});

let Image: Model<ImageDocument>;

// This is to prevent errors with hot module reloading
export function getImageModel(): Model<ImageDocument> {
    if (!Image) {
        try {
            Image = model<ImageDocument>('Image');
        } catch (e) {
            Image = model<ImageDocument>('Image', imageSchema);
        }
    }
    return Image;
}
