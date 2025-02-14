import { connect, disconnect } from 'mongoose';
import { Conversation } from '../src/lib/server/models/conversation';
import { Image } from '../src/lib/server/models/image';
import { ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tmg';

async function seed() {
  try {
    await connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Seed Images
    const images = [
      {
        _id: new ObjectId("65a59e77c8f3a6b7d0e12345"),
        url: "https://your-cdn.com/uploads/bathroom_before.jpg",
        filename: "bathroom_before.jpg",
        contentType: "image/jpeg",
        uploadedBy: new ObjectId("673eea51d9cbe12bb6a8d78a"),
        timestamp: new Date("2024-01-15T15:14:00Z"),
      },
      {
        _id: new ObjectId("65a59e8ac8f3a6b7d0e12346"),
        url: "https://your-cdn.com/uploads/sink_example.jpg",
        filename: "sink_example.jpg",
        contentType: "image/jpeg",
        uploadedBy: new ObjectId("673eea51d9cbe12bb6a8d78a"),
        timestamp: new Date("2024-01-15T15:14:30Z"),
      },
    ];

    // Clear existing images
    await Image.deleteMany({});
    await Image.insertMany(images);
    console.log('Images seeded successfully');

    // Seed Conversation
    const conversation = {
      _id: new ObjectId(),
      toId: new ObjectId("67447c40b64f38d6720806b7"), // Tradesperson ID
      fromId: new ObjectId("673eea51d9cbe12bb6a8d78a"), // Homeowner ID
      messages: [
        {
          _id: new ObjectId(),
          sender: "from",
          content: "Hi there! I'm looking to get some work done on my bathroom. I have a leaky toilet that needs repair, and I'd also like to update the sink and vanity. Could you give me a general idea of the cost for those kinds of repairs/updates?",
          timestamp: new Date("2024-01-15T14:30:00Z"),
          read: false,
          type: "question",
        },
        {
          _id: new ObjectId(),
          sender: "to",
          content: "Hello! Thanks for reaching out. For the toilet repair, it depends on the cause of the leak. If it's a simple flapper or fill valve replacement, it could be around $100-$150 in labor plus parts. If it's a more serious issue like a cracked tank or a problem with the seal at the base, it could be more. I'd need to take a look to give you an accurate estimate.",
          timestamp: new Date("2024-01-15T15:05:00Z"),
          read: false,
          type: "message",
        },
        {
          _id: new ObjectId(),
          sender: "to",
          content: "For the sink and vanity, prices vary widely depending on the materials and style you choose. A basic pedestal sink replacement might start around $200-$300 for labor, while a new vanity with a countertop and sink could range from $500 to $2000+ for labor, depending on size and complexity. Do you have any pictures of the existing bathroom and the type of sink/vanity you're interested in?",
          timestamp: new Date("2024-01-15T15:08:00Z"),
          read: false,
          type: "question",
        },
        {
          _id: new ObjectId(),
          sender: 'from',
          content: 'Sure, let me find some to send',
          timestamp: new Date("2024-01-15T15:10:00Z"),
          read: false,
          type: "message",
        },
        {
          _id: new ObjectId(),
          sender: "from",
          content: null,
          timestamp: new Date("2024-01-15T15:15:00Z"),
          read: false,
          type: "image",
          imageIds: [
            new ObjectId("65a59e77c8f3a6b7d0e12345"),
            new ObjectId("65a59e8ac8f3a6b7d0e12346"),
          ],
        },
        {
          _id: new ObjectId(),
          sender: "to",
          content: "Thanks! Looking at the pictures, the toilet looks like a standard model. Assuming it's a straightforward fix, I'd estimate $125 for the repair. The vanity is a bit more involved. Based on the style, and if you go with a similar size and quality, I'd estimate around $800 for labor to remove the old one and install the new one, including connecting the plumbing.",
          timestamp: new Date("2024-01-15T15:45:00Z"),
          read: false,
          type: "quote",
        },
        {
          _id: new ObjectId(),
          sender: 'from',
          content: 'Ok great thanks! When are you free?',
          timestamp: new Date("2024-01-15T15:47:00Z"),
          read: false,
          type: "message",
        }
      ],
    };

    // Clear existing conversations
    await Conversation.deleteMany({});
    await Conversation.create(conversation);
    console.log('Conversation seeded successfully');

    await disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
