import type { PageServerLoad } from './$types';
import { connectToDatabase } from '$lib/server/db';
import type { Professional, ServiceCategory } from '$lib/types/professional';

export const load: PageServerLoad = async () => {
    const db = await connectToDatabase();
    
    // Fetch categories
    const dbCategories = await db.collection('servicecategories').find({}).toArray();
    
    const allProfessionalsCategory = {
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
    const professionalsWithReviews = await db.collection('users').aggregate([
        { $match: { isPro: true } },
        {
            $lookup: {
                from: 'reviews',
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
                from: 'projects',
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
                            projectImages: { $slice: ['$projectImages', 4] } // Limit to 4 images per professional
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
    ]).toArray();

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
            businessInfo: pro.businessInfo || {},
            image: pro.image,
            isFavorite: pro.isFavorite || false,
            projectImages: pro.projectImages.map(img => ({
                url: img.url,
                caption: img.caption,
                _id: img._id ? img._id.toString() : undefined
            }))
        }))
    };
};
