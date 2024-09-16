"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Task from "./Task";

type ColumnProps = {
  column: {
    id: string;
    title: string;
    tasks: { id: string; content: string }[];
  };
};

const Column: React.FC<ColumnProps> = ({ column }) => {
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
                {column.tasks.map(task => (
                    <Task key={task.id} id={task.id} content={task.content} />
                ))}
            </ul>
        </SortableContext>
    </div>
  );
};

export default Column;
