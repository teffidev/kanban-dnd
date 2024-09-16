"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

type TaskProps = {
  id: string;
  content: string;
};

const Task: React.FC<TaskProps> = ({ id, content }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <li
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-white p-2 rounded shadow cursor-move list-none">
        {content}
      </li>
    </>
  );
};

export default Task;
