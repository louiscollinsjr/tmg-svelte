import mongoose from 'mongoose';
import { getProjectModel } from '../src/lib/server/models/project';
import { getUserModel } from '../src/lib/server/models/user';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tmg-ai-assist';

const projectTemplates = [
    {
        title: 'Kitchen Renovation - Modern Design',
        description: 'Complete kitchen remodel including new cabinets, countertops, and appliances. Looking for a contractor experienced in modern design. The space is approximately 200 sq ft and needs complete renovation including electrical and plumbing updates.',
        budget: 45000,
        city: 'San Francisco',
        state: 'CA',
        zipcode: '94105'
    },
    {
        title: 'Master Bathroom Remodel',
        description: 'Master bathroom needs a complete overhaul. Project includes new shower, freestanding tub, double vanity, and heated floors. Current space is outdated and requires demolition before new installation.',
        budget: 35000,
        city: 'Oakland',
        state: 'CA',
        zipcode: '94612'
    },
    {
        title: 'Backyard Deck Construction',
        description: 'Need a new composite deck built in the backyard. Area is approximately 400 sq ft. Project includes built-in seating and stairs. Looking for someone with experience in outdoor living spaces.',
        budget: 25000,
        city: 'Berkeley',
        state: 'CA',
        zipcode: '94704'
    },
    {
        title: 'Home Office Addition',
        description: 'Convert existing garage space into a home office. Need insulation, drywall, electrical work, and custom built-in shelving. Space is approximately 300 sq ft.',
        budget: 30000,
        city: 'San Jose',
        state: 'CA',
        zipcode: '95113'
    },
    {
        title: 'Roof Replacement and Solar Installation',
        description: 'Need complete roof replacement and installation of solar panels. House is 2,000 sq ft with moderate pitch. Looking for contractor certified in both roofing and solar installation.',
        budget: 55000,
        city: 'Mountain View',
        state: 'CA',
        zipcode: '94041'
    },
    {
        title: 'Basement Finishing Project',
        description: 'Unfinished basement needs to be converted into living space. Project includes bathroom addition, entertainment area, and small kitchenette. Area is approximately 800 sq ft.',
        budget: 65000,
        city: 'Palo Alto',
        state: 'CA',
        zipcode: '94301'
    },
    {
        title: 'Window Replacement - Entire Home',
        description: 'Replace all windows in 2-story home with energy-efficient models. Total of 15 windows. Need experienced contractor with knowledge of energy-efficient products.',
        budget: 28000,
        city: 'San Mateo',
        state: 'CA',
        zipcode: '94401'
    },
    {
        title: 'Front Yard Landscaping',
        description: 'Complete front yard redesign including new irrigation system, hardscaping, and drought-resistant plants. Area is approximately 1,000 sq ft.',
        budget: 22000,
        city: 'Fremont',
        state: 'CA',
        zipcode: '94538'
    },
    {
        title: 'Home Theater Installation',
        description: 'Convert spare room into home theater. Need sound proofing, custom lighting, wiring for audio/video equipment, and tiered seating installation.',
        budget: 40000,
        city: 'Santa Clara',
        state: 'CA',
        zipcode: '95050'
    },
    {
        title: 'Whole House Paint Job',
        description: 'Interior and exterior painting needed for 2,500 sq ft home. Includes minor drywall repair and trim work. Looking for attention to detail and premium paint products.',
        budget: 18000,
        city: 'Sunnyvale',
        state: 'CA',
        zipcode: '94086'
    }
];

async function createTestProject() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const User = getUserModel();
        const Project = getProjectModel();

        // First, find a user to be the client
        const client = await User.findOne({}).lean();

        if (!client) {
            console.error('No users found in the database');
            process.exit(1);
        }

        console.log('Creating test projects...');

        // Create all projects
        for (const template of projectTemplates) {
            const project = new Project({
                client: client._id,
                contractor: client._id, // Temporarily set to same user, should be updated when accepted
                status: 'pending',
                ...template,
                timeline: {
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
                },
                images: [
                    {
                        url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858',
                        caption: 'Reference Image',
                        _id: new mongoose.Types.ObjectId()
                    }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await project.save();
            console.log(`Created project: ${template.title}`);
        }

        console.log('All test projects created successfully!');
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error creating test projects:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

createTestProject();
