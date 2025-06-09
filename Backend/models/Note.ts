import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
    title: string;
    content: string;
    userId: mongoose.Types.ObjectId;
    tags: string[];
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const NoteSchema: Schema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    tags: [{
        type: String,
        trim: true
    }],
    isPublic: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Create indexes for better query performance
NoteSchema.index({ userId: 1, createdAt: -1 });
NoteSchema.index({ tags: 1 });
NoteSchema.index({ isPublic: 1 });

export default mongoose.model<INote>('Note', NoteSchema); 