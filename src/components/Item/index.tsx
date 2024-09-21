"use client";

import React, {useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";

type ItemProps = {
  item: {
    id: string;
    tasks: {
      id: string;
      content: string;
      completed: boolean;
      action: () => void;
    }[];
  };
  onTaskCompletion: (taskId: string) => void;
  allTasksCompleted: boolean;
  currentColumnIndex: number;
  columnsLength: number;
};

export default function Item({
  item,
  onTaskCompletion,
  allTasksCompleted,
  currentColumnIndex,
  columnsLength,
}: ItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  const completedTasks = item.tasks.filter((task) => task.completed);
  const incompleteTasks = item.tasks.filter((task) => !task.completed);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-4 rounded-lg shadow-md relative">
      {allTasksCompleted && currentColumnIndex < columnsLength - 1 && (
        <div
          {...attributes}
          {...listeners}
          className="absolute right-4 top-2 cursor-move">
          <Button
            variant="outline"
            size="sm"
            className="bg-orange-500 text-white hover:bg-orange-600 hover:text-white flex items-center space-x-2">
            <span>Continuar al siguiente estado</span>
            <GripVertical className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="mt-10">
        {incompleteTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between space-x-2 mb-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={task.id}
                checked={task.completed}
                onCheckedChange={() => onTaskCompletion(task.id)}
                className="border-orange-500 text-orange-500 focus:ring-orange-500 shadow-lg"
              />
              <label
                htmlFor={task.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black">
                {task.content}
              </label>
            </div>
            <Button
              onClick={task.action}
              variant="outline"
              size="sm"
              className="bg-orange-500 text-white hover:bg-orange-600 hover:text-white shadow-lg">
              Acción
            </Button>
          </div>
        ))}

        {completedTasks.length > 0 && (
          <div className="mt-4">
            <Button
              onClick={() => setShowCompletedTasks(!showCompletedTasks)}
              variant="outline"
              size="sm"
              className="w-full flex justify-between items-center">
              Tareas completadas ({completedTasks.length})
              {showCompletedTasks ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            {showCompletedTasks && (
              <div className="mt-2">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between space-x-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={task.id}
                        checked={task.completed}
                        onCheckedChange={() => onTaskCompletion(task.id)}
                        className="border-orange-500 text-orange-500 focus:ring-orange-500"
                      />
                      <label
                        htmlFor={task.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black">
                        {task.content}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
