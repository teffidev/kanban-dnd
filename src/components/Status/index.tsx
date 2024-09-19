"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";

type StatusProps = {
  id: string;
  content: string;
  onDelete: () => void;
};

const Status: React.FC<StatusProps> = ({ id, content, onDelete }) => {
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
        className="bg-white p-2 rounded shadow-sm flex justify-between items-center">
        <span>{content}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-red-500 hover:text-red-700 focus:outline-none">
          <XMarkIcon className="h-5 w-5" />
        </button>
      </li>
    </>
  );
};

export default Status;
