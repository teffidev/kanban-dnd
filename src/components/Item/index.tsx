'use client'

import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

type ItemProps = {
  item: {
    id: string
    tasks: {
      id: string
      content: string
      completed: boolean
      action: () => void
    }[]
  }
  onTaskCompletion: (taskId: string) => void
}

export default function Item({ item, onTaskCompletion }: ItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-white p-4 rounded-lg shadow-md cursor-move">
      {item.tasks.map(task => (
        <div key={task.id} className="flex items-center justify-between space-x-2 mb-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={task.id}
              checked={task.completed}
              onCheckedChange={() => onTaskCompletion(task.id)}
            />
            <label
              htmlFor={task.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
            >
              {task.content}
            </label>
          </div>
          <Button onClick={task.action} variant="outline" size="sm" className="bg-orange-500 text-white hover:bg-orange-600">
            Acción
          </Button>
        </div>
      ))}
    </div>
  )
}