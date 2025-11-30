"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Note } from "@/types/note";
import { deleteNote } from "@/lib/api";
import css from "./NoteList.module.css";

export interface NoteListProps {
  notes: Note[];
}

const NoteList = ({ notes }: NoteListProps) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  if (!notes || notes.length === 0) {
    return <p className={css.empty}>No notes found.</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.item}>
          <div>
            <Link href={`/notes/${note.id}`} className={css.link}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
            </Link>

            {note.tag && note.tag.trim() !== "" && (
              <span className={css.tag}>#{note.tag}</span>
            )}

            <div className={css.footer}>
              <Link href={`/notes/${note.id}`} className={css.button}>
                View details
              </Link>

              <button onClick={() => mutate(note.id)} className={css.button}>
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
