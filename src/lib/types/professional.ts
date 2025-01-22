// Base type that matches the initial data from the server
export interface BaseProfessional {
    _id: string;
    name: string;
    email: string;
    isPro: boolean;
    categories: string[];
    avatar?: string;
    bio?: string;
    location?: string;
    rating?: number;
    reviewCount?: number;
    businessInfo?: BusinessInfo;
    selectedServices?: SelectedService[];
}

export interface ServiceCategory {
    slug: string;
    name: string;
    icon?: string;
    description?: string;
    options?: ServiceOption[];
}

export interface ServiceOption {
    id: string;
    name: string;
    slug: string;
    description: string;
    popular: boolean;
}

export interface SelectedService {
    categoryId: string;
    optionId: string;
    categoryName?: string;
    _id?: {
        $oid: string;
    };
}

export interface Address {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
}

export interface Contact {
    phone?: string;
    email?: string;
    address?: Address;
}

export interface BusinessInfo {
    companyName?: string;
    yearsInBusiness?: number;
    license?: string;
    insurance?: string;
    specialties?: string[];
    serviceArea?: string[];
    website?: string;
    phone?: string;
}

// Rich type for displaying professionals with all possible fields
export interface Professional {
    _id: string | { $oid: string };
    name: string;
    email: string;
    image?: string;
    avatar?: string;
    isPro: boolean;
    providers?: Provider[];
    contact?: Contact;
    businessInfo?: BusinessInfo;
    preferences?: Preferences;
    selectedServices?: SelectedService[];
    lastActive?: {
        $date: string;
    };
    status?: 'active' | 'inactive' | 'suspended';
    createdAt?: {
        $date: string;
    };
    updatedAt?: {
        $date: string;
    };
    isFavorite?: boolean;
    rating?: number;
    reviewCount?: number;
    projectImages?: string[];
    categories?: string[];
}

export interface Provider {
    name: string;
    providerId: string;
    lastLogin: {
        $date: string;
    };
    _id: {
        $oid: string;
    };
}

export interface Preferences {
    notifications: {
        email: boolean;
        push: boolean;
        marketing: boolean;
    };
    visibility: 'public' | 'private';
}

export interface ProjectImage {
    url: string;
    caption?: string;
}

export interface Review {
    _id: string;
    project: string;
    owner: string;
    contractor: string;
    rating: number;
    title: string;
    content: string;
    images?: ProjectImage[];
    status: 'published' | 'pending' | 'reported' | 'removed';
    helpful: {
        count: number;
        users: string[];
    };
    responses?: Array<{
        author: string;
        content: string;
        createdAt: Date;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

// Helper function to transform professional data
export function transformProfessional(data: any): Professional {
    return {
        _id: typeof data._id === 'string' ? { $oid: data._id } : data._id,
        name: data.name,
        email: data.email,
        image: data.image || data.avatar,
        avatar: data.avatar,
        isPro: data.isPro ?? true,
        selectedServices: data.selectedServices || [],
        businessInfo: data.businessInfo || {},
        rating: data.rating || 0,
        reviewCount: data.reviewCount || 0,
        isFavorite: data.isFavorite || false,
        categories: data.categories || [],
        ...data
    };
}
