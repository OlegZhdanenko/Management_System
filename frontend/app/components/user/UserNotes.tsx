"use client";
import React from "react";
import { Note } from "@/types";
import { Paper, Typography } from "@mui/material";

export default function UserNotes({ notes }: { notes?: Note[] }) {
  return (
    <Paper className="p-4">
      <Typography variant="h6" className="mb-3">
        Notes
      </Typography>
      {notes?.length ? (
        notes.map((n) => (
          <div key={n.id} className="mb-3 border-b pb-2">
            <div className="font-medium">{n.title}</div>
            <div className="text-sm text-gray-600">{n.content}</div>
          </div>
        ))
      ) : (
        <Typography variant="body2">No notes</Typography>
      )}
    </Paper>
  );
}
