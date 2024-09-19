"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Status from "../Status";

type ColumnProps = {
  column: {
    id: string;
    title: string;
    tasks: { id: string; content: string }[];
  };
  onAddItem: () => void;
  onDeleteItem: (itemId: string) => void;
};

const Column: React.FC<ColumnProps> = ({ column, onAddItem, onDeleteItem }) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md w-80">
      <h2>{column.title}</h2>
      <SortableContext
        items={column.tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}>
        <ul ref={setNodeRef} className="list-none p-0 flex flex-col gap-2">
          {column.tasks.map((task) => (
            <Status
              key={task.id}
              id={task.id}
              content={task.content}
              onDelete={() => onDeleteItem(task.id)}
            />
          ))}
        </ul>
      </SortableContext>
      <button
        onClick={onAddItem}
        className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        Add Item
      </button>
    </div>
  );
};

export default Column;
