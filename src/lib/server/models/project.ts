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
    title: {
        type: String,
        required: true
    },
    description: String,
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
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export interface ProjectDocument extends mongoose.Document {
    contractor: mongoose.Types.ObjectId;
    client: mongoose.Types.ObjectId;
    title: string;
    description?: string;
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
    createdAt: Date;
    updatedAt: Date;
}

let Project: Model<ProjectDocument>;

export function getProjectModel(): Model<ProjectDocument> {
    if (!Project) {
        Project = mongoose.models.Project || mongoose.model<ProjectDocument>('Project', projectSchema);
    }
    return Project;
}
