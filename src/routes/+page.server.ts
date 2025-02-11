import type { PageServerLoad } from './$types';
import { connectDB } from '$lib/server/db';
import type { Professional, ServiceCategory } from '$lib/types/professional';
import mongoose, { Model, Schema } from 'mongoose';
import { getUserModel } from '$lib/server/models/user';
import { getReviewModel } from '$lib/server/models/review';
import { getProjectModel } from '$lib/server/models/project';

// Define ServiceCategory Schema
const serviceCategorySchema = new Schema({
    slug: String,
    name: String,
    icon: String,
    description: String,
    options: [
        {
            id: String,
            name: String,
            slug: String,
            description: String,
            popular: Boolean
        }
    ]
});

// Create or get the model
const ServiceCategoryModel: Model<ServiceCategory> = mongoose.models.ServiceCategory || 
    mongoose.model('ServiceCategory', serviceCategorySchema);

export const load: PageServerLoad = async () => {
    await connectDB();
    const User = getUserModel();
    const Review = getReviewModel();
    const Project = getProjectModel();
    
    // Fetch categories
    const dbCategories = await ServiceCategoryModel.find({}).lean<ServiceCategory>();
    
    const allProfessionalsCategory: ServiceCategory = {
        slug: 'all-professionals',
        name: 'All Professionals',
        icon: 'warehouse',
        description: 'View all available professionals'
    };

    const categories = [
        allProfessionalsCategory,
        ...dbCategories.map(category => ({
            slug: category.slug,
            name: category.name,
            icon: category.icon,
            description: category.description,
            options: category.options?.map(option => ({
                id: option.id,
                name: option.name,
                slug: option.slug,
                description: option.description,
                popular: option.popular
            }))
        }))
    ];

    // Fetch professionals with their review data and project images
    const professionalsWithReviews = await User.aggregate([
        { $match: { isPro: true } },
        {
            $lookup: {
                from: Review.collection.name,
                let: { professionalId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$contractor', '$$professionalId'] },
                            status: 'published'
                        }
                    }
                ],
                as: 'reviews'
            }
        },
        {
            $lookup: {
                from: Project.collection.name,
                let: { professionalId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$contractor', '$$professionalId'] },
                            status: 'completed'
                        }
                    },
                    {
                        $unwind: '$images'
                    },
                    {
                        $group: {
                            _id: '$contractor',
                            projectImages: {
                                $push: {
                                    url: '$images.url',
                                    caption: '$images.caption',
                                    _id: '$images._id'
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            projectImages: { $slice: ['$projectImages', 4] }
                        }
                    }
                ],
                as: 'projectData'
            }
        },
        {
            $addFields: {
                reviewCount: { $size: '$reviews' },
                rating: {
                    $cond: {
                        if: { $gt: [{ $size: '$reviews' }, 0] },
                        then: { $avg: '$reviews.rating' },
                        else: 0
                    }
                },
                projectImages: {
                    $ifNull: [{ $first: '$projectData.projectImages' }, []]
                }
            }
        }
    ]);

    return { 
        categories,
        professionals: professionalsWithReviews.map(pro => ({
            _id: pro._id.toString(),
            name: pro.name,
            email: pro.email,
            isPro: pro.isPro,
            categories: pro.categories || [],
            avatar: pro.avatar,
            bio: pro.bio,
            location: pro.location,
            rating: pro.rating || 0,
            reviewCount: pro.reviewCount || 0,
            selectedServices: (pro.selectedServices || []).map(service => ({
                categoryId: service.categoryId,
                optionId: service.optionId,
                categoryName: service.categoryName,
                _id: service._id ? service._id.toString() : undefined
            })),
            businessInfo: pro.businessInfo ? {
                ...pro.businessInfo,
                _id: pro.businessInfo._id ? pro.businessInfo._id.toString() : undefined
            } : {},
            image: pro.image,
            isFavorite: pro.isFavorite || false,
            projectImages: pro.projectImages.map(img => ({
                url: img.url,
                caption: img.caption,
                _id: img._id.toString()
            }))
        }))
    };
};
