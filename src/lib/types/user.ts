export interface User {
    email: string;
    name: string;
    image: string;
    isPro: boolean;
    subscription: 'Starter Kit' | 'Pro Connect' | 'Master Craftsman' | 'Elite Contractor';
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
}
