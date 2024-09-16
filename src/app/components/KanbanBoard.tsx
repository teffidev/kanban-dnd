"use client";

import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import React, { useState } from "react";
import Column from "./Column";
import Task from "./Task";

type TaskType = {
  id: string;
  content: string;
};

type ColumnTyep = {
  id: string;
  title: string;
  tasks: TaskType[];
};

const initialColumns: ColumnTyep[] = [
  {
    id: "todo",
    title: "To Do",
    tasks: [
      {
        id: "1",
        content: "Buy milk",
      },
      {
        id: "2",
        content: "Buy bread",
      },
    ],
  },
  {
    id: "doing",
    title: "Doing",
    tasks: [
      {
        id: "3",
        content: "Buy apples",
      },
      {
        id: "4",
        content: "Buy pears",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      {
        id: "5",
        content: "Buy oranges",
      },
      {
        id: "6",
        content: "Buy eggs",
      },
    ],
  },
];

const KanbanBoard = () => {
  const [columns, setColumns] = useState<ColumnTyep[]>(initialColumns);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    if (active.id !== activeId) {
      setActiveId(active.id);
    }
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    const activeColumn = columns.find((col) =>
      col.tasks.some((task) => task.id === active.id)
    );
    const overColumn = columns.find(
      (col) =>
        col.id === over.id || col.tasks.some((task) => task.id === over.id)
    );

    if (!activeColumn || !overColumn || activeColumn === overColumn) return;

    setColumns((cols) => {
      const activeItems = activeColumn.tasks;
      const overItems = overColumn.tasks;

      const activeIndex = activeItems.findIndex(
        (item) => item.id === active.id
      );
      const overIndex = overItems.findIndex((item) => item.id === over.id);

      let newIndex: number;
      if (over.id in columns) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;

        const modifier = isBelowOverItem ? -1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return cols.map((col) => {
        if (col.id === activeColumn.id) {
          return {
            ...col,
            tasks: col.tasks.filter((item) => item.id !== active.id),
          };
        } else if (col.id === overColumn.id) {
          return {
            ...col,
            tasks: [
              ...col.tasks.slice(0, newIndex),
              columns
                .flatMap((col) => col.tasks)
                .find((task) => task.id === active.id)!,
              ...col.tasks.slice(newIndex),
            ],
          };
        } else {
          return col;
        }
      });
    });
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeColumn = columns.find((col) =>
      col.tasks.some((task) => task.id === active.id)
    );
    const overColumn = columns.find(
      (col) =>
        col.id === over.id || col.tasks.some((task) => task.id === over.id)
    );

    if (!activeColumn || !overColumn || activeColumn === overColumn) return;

    const activeIndex = activeColumn.tasks.findIndex(
      (task) => task.id === active.id
    );
    const overIndex = overColumn.tasks.findIndex((task) => task.id === over.id);

    if (activeIndex !== overIndex) {
      setColumns((cols) => {
        const newTasks = arrayMove(overColumn.tasks, activeIndex, overIndex);
        return cols.map((col) => {
          if (col.id === overColumn.id) {
            return { ...col, tasks: newTasks };
          }
          return col;
        });
      });
    }
    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}>
      <div className="flex gap-4 p-4">
        {columns.map((column) => (
          <Column key={column.id} column={column} />
        ))}
      </div>
      <DragOverlay>
        {activeId ? (
          <Task
            id={activeId}
            content={
              columns
                .flatMap((col) => col.tasks)
                .find((task) => task.id === activeId)?.content || ""
            }
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
