import type { Model } from 'mongoose';
import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema({
    name: String,
    providerId: String,
    lastLogin: Date
});

const businessInfoSchema = new mongoose.Schema({
    serviceArea: [String],
    specialties: [String]
});

const notificationsSchema = new mongoose.Schema({
    email: Boolean,
    push: Boolean,
    marketing: Boolean
});

const preferencesSchema = new mongoose.Schema({
    notifications: notificationsSchema,
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    }
});

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: String,
    isPro: { type: Boolean, default: false },
    providers: [providerSchema],
    businessInfo: businessInfoSchema,
    preferences: preferencesSchema,
    lastActive: Date,
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    }
}, {
    timestamps: true
});

export type UserDocument = mongoose.Document & {
    email: string;
    name: string;
    image: string;
    isPro: boolean;
    providers: Array<{
        name: string;
        providerId: string;
        lastLogin: Date;
    }>;
    businessInfo: {
        serviceArea: string[];
        specialties: string[];
    };
    preferences: {
        notifications: {
            email: boolean;
            push: boolean;
            marketing: boolean;
        };
        visibility: 'public' | 'private';
    };
    lastActive: Date;
    status: 'active' | 'inactive' | 'suspended';
    createdAt: Date;
    updatedAt: Date;
};

let User: Model<UserDocument>;

// This is to prevent errors with hot module reloading
export function getUserModel(): Model<UserDocument> {
    if (!User) {
        User = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);
    }
    return User;
}
