// schema.ts
import { z } from 'zod';

// Combined schema for the entire form
export const combinedSchema = z.object({
    // Project Details
    title: z.string().min(1, 'Title is required'),
    category: z.string().min(1, 'Category is required'),
    description: z.string().optional().default(''),
    projectTypes: z.string().optional(),

    // Image Upload
    images: z.array(z.instanceof(File)).optional(),

    // Budget and Timeline
    budget: z.number().min(0, 'Budget must be greater than zero').optional(), // Make sure this is a number
    timeline: z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        completedDate: z.date().optional()
    }).optional(),

    // About You
    zipcode: z.string().optional().default(''),
    city: z.string().optional().default(''),
    state: z.string().optional().default('')
});

// Step schemas using pick
export const steps = [
    // Step 1: Welcome (no validation needed)
    z.object({}),

    // Step 2: Project Details
    combinedSchema.pick({
        title: true,
        category: true,
        description: true,
        projectTypes: true
    }),

    // Step 3: Image Upload
    combinedSchema.pick({
        images: true
    }),

    // Step 4: Budget and Timeline
    combinedSchema.pick({
        budget: true,
        timeline: true
    }),

    // Step 5: About You
    combinedSchema.pick({
        city: true,
        state: true,
        zipcode: true
    })
] as const;