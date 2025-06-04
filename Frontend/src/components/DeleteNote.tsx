import React from "react";

type DeleteNoteProps = {
  noteId: string;
  onDelete: (id: string) => void;
};

const DeleteNote: React.FC<DeleteNoteProps> = ({ noteId, onDelete }) => (
  <button onClick={() => onDelete(noteId)} style={{ color: "red" }}>
    Delete
  </button>
);

export default DeleteNote;
