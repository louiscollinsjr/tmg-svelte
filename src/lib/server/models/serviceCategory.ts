import mongoose, { Model, Schema } from 'mongoose';

interface ServiceCategoryDocument {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    displayOrder: number;
    featured: boolean;
    options?: Array<any>;
    createdAt: Date;
    updatedAt: Date;
}

const serviceCategorySchema = new Schema<ServiceCategoryDocument>({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    icon: String,
    displayOrder: {
        type: Number,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    options: [{
        type: Schema.Types.Mixed
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

let ServiceCategory: Model<ServiceCategoryDocument>;

export function getServiceCategoryModel(): Model<ServiceCategoryDocument> {
    if (!ServiceCategory) {
        ServiceCategory = mongoose.models.ServiceCategory || mongoose.model<ServiceCategoryDocument>('ServiceCategory', serviceCategorySchema);
    }
    return ServiceCategory;
}

export type { ServiceCategoryDocument };
