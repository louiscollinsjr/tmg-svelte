import mongoose from 'mongoose';
import { getServiceCategoryModel } from '../src/lib/server/models/serviceCategory';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tmg-ai-assist';

const categories = [
    {
        name: 'Kitchen Remodeling',
        description: 'Full kitchen renovations, cabinet installations, and countertop replacements',
        icon: '🏠'
    },
    {
        name: 'Bathroom Renovation',
        description: 'Complete bathroom remodels, fixture installations, and tile work',
        icon: '🚿'
    },
    {
        name: 'Outdoor & Landscaping',
        description: 'Landscape design, deck construction, and outdoor living spaces',
        icon: '🌳'
    },
    {
        name: 'Interior Renovation',
        description: 'Interior remodeling, room additions, and structural modifications',
        icon: '🏗️'
    },
    {
        name: 'Painting & Finishing',
        description: 'Interior and exterior painting, wallpaper, and decorative finishes',
        icon: '🎨'
    },
    {
        name: 'Flooring Installation',
        description: 'Hardwood, tile, carpet, and other flooring installations',
        icon: '🔨'
    },
    {
        name: 'Electrical Work',
        description: 'Electrical installations, upgrades, and smart home systems',
        icon: '⚡'
    },
    {
        name: 'Plumbing Services',
        description: 'Plumbing repairs, installations, and water system upgrades',
        icon: '🔧'
    }
];

async function createServiceCategories() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const ServiceCategory = getServiceCategoryModel();

        // Create all categories
        for (const category of categories) {
            const existingCategory = await ServiceCategory.findOne({ name: category.name });
            
            if (!existingCategory) {
                const newCategory = new ServiceCategory(category);
                await newCategory.save();
                console.log(`Created category: ${category.name}`);
            } else {
                console.log(`Category already exists: ${category.name}`);
            }
        }

        console.log('All service categories created successfully!');
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error creating service categories:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

createServiceCategories();
