// schema.ts
import { z } from 'zod';

export const projectTypes = ['Cookies and cream', 'Mint choc chip', 'Raspberry ripple'] as const;

// Combined schema for the entire form
export const combinedSchema = z.object({
	// Project Details
	description: z.string().optional().default(''),
	projectTypes: z.enum(['Cookies and cream', 'Mint choc chip', 'Raspberry ripple']).optional(),

	// Image Upload
	images: z.array(z.instanceof(File)).optional(),

	// Budget and Timeline
	budget: z.number().min(0, 'Budget must be greater than zero').optional(),
	timeline: z
		.object({
			startDate: z.date().optional(),
			endDate: z.date().optional(),
			completedDate: z.date().optional()
		})
		.optional(),

	// About You
	name: z.string().optional().default(''),
	city: z.string().optional().default(''),
	state: z.string().optional().default('')
});

// Step schemas using pick
export const steps = [
	// Step 1: Welcome (no validation needed)
	z.object({}),

	// Step 2: Project Details
	combinedSchema.pick({
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
		name: true,
		city: true,
		state: true
	})
] as const;

// Individual step schemas (if needed)
// export const schemaWelcome = z.object({});

// export const schemaProjectDetails = z.object({
//     description: z.string().min(1).default(""),
//     projectTypes: z.enum(projectTypes),
// });

// export const schemaImageUpload = z.object({
//     images: z.array(z.instanceof(File)).optional(),
// });

// export const schemaTimeBudget = z.object({
//     budget: z.enum(['0-5000', '5000-10000', '10000-15000', '15000-20000', '20000+']).optional(),
//     timeline: z.enum(['immediately', '1-2 weeks', '2-4 weeks', '4-6 weeks', '6-8 weeks', '8-12 weeks', '12+ weeks']).optional(),
// });

// export const schemaAboutYou = z.object({
//     name: z.string().min(1).optional(),
//     city: z.string().min(1).optional(),
//     state: z.string().min(1).optional(),
// });

// Type for the entire form data
//export type FormData = z.infer<typeof combinedSchema>;
