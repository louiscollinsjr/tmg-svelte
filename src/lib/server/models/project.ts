import mongoose, { Model, Schema } from 'mongoose';

const imageSchema = new Schema({
    url: String,
    caption: String,
    _id: Schema.Types.ObjectId
});

const projectSchema = new Schema({
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
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    category: {
        type: String,
        ref: 'ServiceCategory',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    budget: {
        type: Number,
        required: true
    },
    timeline: {
        startDate: Date,
        endDate: Date,
        completedDate: Date
    },
    images: [imageSchema],
    city: String,
    state: String,
    zipcode: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

let Project: Model<ProjectDocument>;

export function getProjectModel(): Model<ProjectDocument> {
    if (!Project) {
        Project = mongoose.models.Project || mongoose.model<ProjectDocument>('Project', projectSchema);
    }
    return Project;
}

export interface ProjectDocument {
    contractor: mongoose.Types.ObjectId;
    client: mongoose.Types.ObjectId;
    owner?: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    category: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    budget: number;
    timeline?: {
        startDate?: Date;
        endDate?: Date;
        completedDate?: Date;
    };
    images: Array<{
        url: string;
        caption?: string;
        _id: mongoose.Types.ObjectId;
    }>;
    city?: string;
    state?: string;
    zipcode?: string;
    createdAt: Date;
    updatedAt: Date;
}
