"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
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
import Column from "../Column";
import Status from "../Status";
import ModalAddItem from "../Modal";

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
    id: "status1",
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
    id: "status2",
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
    id: "status3",
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

  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [itemName, setItemName] = useState("");
  const [currentColumnId, setCurrentColumnId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onAddItem = () => {
    if (!itemName || !currentColumnId) return;
  
    const newItem: TaskType = {
      id: uuidv4(),
      content: itemName,
    };
  
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === currentColumnId
          ? { ...column, tasks: [...column.tasks, newItem] }
          : column
      )
    );
  
    setItemName("");
    setShowAddItemModal(false);
    setCurrentColumnId(null);
  };

  const handleAddItemClick = (columnId: string) => {
    setCurrentColumnId(columnId);
    setShowAddItemModal(true);
  };

  const handleDeleteItem = (itemId: string) => {
    setColumns((prevColumns) => {
      const newColumns = prevColumns.map((column) => {
        const newTasks = column.tasks.filter((task) => task.id !== itemId);
        if (newTasks.length !== column.tasks.length) {
          return { ...column, tasks: newTasks };
        }
        return column;
      });
      return newColumns;
    });
  };

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

        const modifier = isBelowOverItem ? 1 : 0;

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
    <div className="mx-auto max-w-7xl py-10 px-3 sm:px-6 lg:px-8">
      {/* Add item Modal */}
      <ModalAddItem
        showModal={showAddItemModal}
        setShowModal={setShowAddItemModal}>
        <div className="flex flex-col w-full items-start gap-y-4">
          <h1 className="text-gray-800 text-3xl font-bold">Add Item</h1>
          <input
            type="text"
            placeholder="Item Title"
            name="itemname"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={onAddItem}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Add Item
          </button>
        </div>
      </ModalAddItem>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}>
        <div className="flex gap-4 p-4">
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onAddItem={() => handleAddItemClick(column.id)}
              onDeleteItem={() => handleDeleteItem(column.id)}
            />
          ))}
        </div>
        <DragOverlay>
          {activeId ? (
            <Status
              id={activeId}
              content={
                columns
                  .flatMap((col) => col.tasks)
                  .find((task) => task.id === activeId)?.content || ""
              }
              onDelete={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
