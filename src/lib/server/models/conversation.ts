import { Schema, model, type Model } from 'mongoose';
import type { UserDocument } from './user';
import type { ImageDocument } from './image';

interface ConversationMessage {
    sender: 'to' | 'from';
    content?: string;
    timestamp: Date;
    read: boolean;
    type: 'message' | 'question' | 'quote' | 'image';
    imageIds?: ImageDocument[];
}

interface ConversationDocument {
    toId: UserDocument;
    fromId: UserDocument;
    messages: ConversationMessage[];
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema({
    sender: { type: String, enum: ['to', 'from'], required: true },
    content: { type: String },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
    type: { type: String, enum: ['message', 'question', 'quote', 'image'], default: 'message' },
    imageIds: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
});

const conversationSchema = new Schema({
    toId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fromId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [messageSchema],
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
