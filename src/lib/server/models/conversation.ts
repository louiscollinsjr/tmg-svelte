import { Schema, model, type Model } from 'mongoose';
import type { UserDocument } from './user';
import type { ImageDocument } from './image';
import type { ProjectDocument } from './project';

interface ConversationMessage {
    sender: string;
    content?: string;
    timestamp: Date;
    read: boolean;
    type: 'message' | 'question' | 'quote' | 'image';
    imageIds?: ImageDocument[];
    projectId?: ProjectDocument;
}

interface ConversationDocument {
    toId: UserDocument;
    fromId: UserDocument;
    messages: ConversationMessage[];
    projectId?: ProjectDocument;
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema({
    sender: { type: String, required: true },
    content: { type: String },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
    type: { type: String, enum: ['message', 'question', 'quote', 'image'], default: 'message' },
    imageIds: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
});

const conversationSchema = new Schema({
    toId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fromId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [messageSchema],
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
}, {
    timestamps: true
});

// Add indexes
conversationSchema.index({ toId: 1, fromId: 1 });
conversationSchema.index({ 'messages.timestamp': -1 });

let Conversation: Model<ConversationDocument>;

// This is to prevent errors with hot module reloading
export function getConversationModel(): Model<ConversationDocument> {
    if (!Conversation) {
        try {
            Conversation = model<ConversationDocument>('Conversation');
        } catch (e) {
            Conversation = model<ConversationDocument>('Conversation', conversationSchema);
        }
    }
    return Conversation;
}
