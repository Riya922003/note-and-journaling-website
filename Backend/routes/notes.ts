import { Request, Response } from 'express';
import Note, { INote } from '../models/Note';

// Get all notes for a user
export const getNotes = async (req: Request, res: Response) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const notes = await Note.find({ userId: req.user._id })
            .sort({ updatedAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notes', error });
    }
};

// Create a new note
export const createNote = async (req: Request, res: Response) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const { title, content, tags, isPublic } = req.body;
        const note = new Note({
            title,
            content,
            tags,
            isPublic,
            userId: req.user._id
        });
        await note.save();
        res.status(201).json(note);
    } catch (error) {
        res.status(400).json({ message: 'Error creating note', error });
    }
};

// Update a note
export const updateNote = async (req: Request, res: Response) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const { id } = req.params;
        const { title, content, tags, isPublic } = req.body;
        
        const note = await Note.findOneAndUpdate(
            { _id: id, userId: req.user._id },
            { title, content, tags, isPublic },
            { new: true, runValidators: true }
        );

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json(note);
    } catch (error) {
        res.status(400).json({ message: 'Error updating note', error });
    }
};

// Delete a note
export const deleteNote = async (req: Request, res: Response) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const { id } = req.params;
        const note = await Note.findOneAndDelete({ _id: id, userId: req.user._id });

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting note', error });
    }
};

// Get a single note
export const getNote = async (req: Request, res: Response) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const { id } = req.params;
        const note = await Note.findOne({ _id: id, userId: req.user._id });

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json(note);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching note', error });
    }
}; 