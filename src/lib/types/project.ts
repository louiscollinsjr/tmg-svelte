// src/lib/types/project.ts
export interface ProjectFormData {
    description: string;
    projectTypes?: "Cookies and cream" | "Mint choc chip" | "Raspberry ripple";
    images?: File[]; // Use File[] to represent selected files
    budget?: number;
    timeline?: "immediately" | "1-2 weeks" | "2-4 weeks" | "4-6 weeks" | "6-8 weeks" | "8-12 weeks" | "12+ weeks";
    name?: string;
    city?: string;
    state?: string;
}