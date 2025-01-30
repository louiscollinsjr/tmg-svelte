// src/lib/types/project.ts
export interface ProjectFormData {
    description: string;
    projectTypes?: "Cookies and cream" | "Mint choc chip" | "Raspberry ripple";
    images?: File[]; // Use File[] to represent selected files
    budget?: number; // If storing as a number
    timeline?: {
        startDate?: Date;
        endDate?: Date;
        completedDate?: Date;
    };
    zipcode?: string;
    city?: string;
    state?: string;
}