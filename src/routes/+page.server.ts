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

    // Fetch professionals
    const professionals = await db.collection('users')
        .find({ isPro: true })
        .toArray();

    return { 
        categories,
        professionals: professionals.map(pro => ({
            _id: pro._id.toString(),
            name: pro.name,
            email: pro.email,
            isPro: pro.isPro,
            categories: pro.categories || [],
            avatar: pro.avatar,
            bio: pro.bio,
            location: pro.location,
            rating: pro.rating,
            reviewCount: pro.reviewCount,
            selectedServices: (pro.selectedServices || []).map(service => ({
                categoryId: service.categoryId,
                optionId: service.optionId,
                categoryName: service.categoryName,
                _id: service._id ? service._id.toString() : undefined
            })),
            businessInfo: pro.businessInfo || {},
            image: pro.image
        }))
    };
};
