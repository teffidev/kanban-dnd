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
    <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full">
      <h2 className="text-lg font-semibold mb-4 text-black">{column.title}</h2>
      <SortableContext
        items={column.tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}>
        <ul
          ref={setNodeRef}
          className="list-none p-0 flex flex-col gap-2 min-h-[100px]">
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
      <div className="flex justify-center">
        <button
          onClick={onAddItem}
          className="mt-4 w-auto px-4 py-2 shadow-lg bg-orange-500 text-white rounded-md hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
          Agregar ítem
        </button>
      </div>
    </div>
  );
};

export default Column;
