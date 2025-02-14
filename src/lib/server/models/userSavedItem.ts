import mongoose from 'mongoose';
import type { Document } from 'mongoose';

export interface UserSavedItem extends Document {
    userId: mongoose.Types.ObjectId;
    itemId: mongoose.Types.ObjectId;
    itemType: string;
    createdAt: Date;
}

const userSavedItemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    itemType: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create indexes for efficient querying
userSavedItemSchema.index({ userId: 1, itemType: 1 });
userSavedItemSchema.index({ userId: 1, itemId: 1, itemType: 1 }, { unique: true });

export function getUserSavedItemModel() {
    return mongoose.models.UserSavedItem || mongoose.model<UserSavedItem>('UserSavedItem', userSavedItemSchema);
}
