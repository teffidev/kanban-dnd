'use client'

import React, { useState, useEffect } from 'react'
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Column from '../Column'
import Item from '../Item'

type Task = {
  id: string
  content: string
  completed: boolean
  action: () => void
}

type Column = {
  id: string
  title: string
  tasks: Task[]
}

const initialColumns: Column[] = [
  {
    id: "status1",
    title: "Revisión de documentos",
    tasks: [
      {
        id: "1",
        content: "Factura comercial",
        completed: false,
        action: () => {},
      },
      {
        id: "2",
        content: "Lista de empaque",
        completed: false,
        action: () => {},
      },
      {
        id: "3",
        content: "Shipping Mark",
        completed: false,
        action: () => {},
      },
      {
        id: "4",
        content: "Datos comerciales",
        completed: false,
        action: () => {},
      },
      {
        id: "5",
        content: "Credenciales Ecuapass",
        completed: false,
        action: () => {},
      },
      {
        id: "6",
        content: "RUC",
        completed: false,
        action: () => {},
      },
      {
        id: "7",
        content: "PDF - Cédula, Papeleta de votación",
        completed: false,
        action: () => {},
      },
    ],
  },
  {
    id: "status2",
    title: "Pre liquidación",
    tasks: [
      {
        id: "8",
        content: "Enviar Email a cliente: Pre liquidación PDF",
        completed: false,
        action: () => {},
      },
    ],
  },
  {
    id: "status3",
    title: "Carga x arribar a bodega",
    tasks: [
      {
        id: "9",
        content: "Enviar Email a cliente: Fecha de corte",
        completed: false,
        action: () => {},
      },
    ],
  },
  {
    id: "status4",
    title: "Carga lista para zarpar",
    tasks: [
      {
        id: "10",
        content: "Enviar Email a cliente: ETD: APROX.",
        completed: false,
        action: () => {},
      },
      {
        id: "11",
        content: "Enviar Email a cliente: ETA: APROX.",
        completed: false,
        action: () => {},
      },
    ],
  },
  {
    id: "status5",
    title: "Zarpe confirmado",
    tasks: [
      {
        id: "12",
        content: "Enviar Email a cliente: Fecha de zarpe",
        completed: false,
        action: () => {},
      },
    ],
  },
  {
    id: "status6",
    title: "En tránsito",
    tasks: [
      {
        id: "13",
        content: "Rastreo",
        completed: false,
        action: () => {},
      },
    ],
  },
  {
    id: "status7",
    title: "Arribo confirmado",
    tasks: [
      {
        id: "14",
        content: "Día y hora Manifiesto",
        completed: false,
        action: () => {},
      },
    ],
  },
  {
    id: "status8",
    title: "En puerto de destino",
    tasks: [
      {
        id: "15",
        content: "MRN",
        completed: false,
        action: () => {},
      },
      {
        id: "16",
        content: "TARJA",
        completed: false,
        action: () => {},
      },
      {
        id: "17",
        content: "CAS",
        completed: false,
        action: () => {},
      },
    ],
  },
  {
    id: "status9",
    title: "Nacionalización y Aforo",
    tasks: [
      {
        id: "18",
        content:
          "Preliminar DAI: Liquidación de aprobación, liquidación final(Pago), información del pago",
        completed: false,
        action: () => {},
      },
      {
        id: "19",
        content: "Documento de Aforo",
        completed: false,
        action: () => {},
      },
      {
        id: "20",
        content: "Registro de posesionamiento (Físico)",
        completed: false,
        action: () => {},
      },
      {
        id: "21",
        content: "Registro fotográfico (Aforo físico)",
        completed: false,
        action: () => {},
      },
      {
        id: "22",
        content: "Observaciones",
        completed: false,
        action: () => {},
      },
    ],
  },
  {
    id: "status10",
    title: "Carga por liberarse",
    tasks: [
      {
        id: "23",
        content: "Carga por liberarse",
        completed: false,
        action: () => {},
      },
    ],
  },
  {
    id: "status11",
    title: "Ultima Milla",
    tasks: [
      {
        id: "24",
        content: "Ultima milla",
        completed: false,
        action: () => {},
      },
    ],
  },
  {
    id: "status12",
    title: "Entregado",
    tasks: [
      {
        id: "25",
        content: "Entregado",
        completed: false,
        action: () => {},
      },
    ],
  },
];

export default function ProgressiveKanban() {
  const [columns, setColumns] = useState<Column[]>(initialColumns)
  const [currentColumnIndex, setCurrentColumnIndex] = useState(0)
  const [item, setItem] = useState({ id: 'item1', tasks: [] as Task[] })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    setItem(prevItem => ({
      ...prevItem,
      tasks: columns.slice(0, currentColumnIndex + 1).flatMap(col => col.tasks)
    }))
  }, [currentColumnIndex, columns])

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id === item.id && over?.id) {
      // const oldIndex = columns.findIndex(col => col.id === columns[currentColumnIndex].id)
      const newIndex = columns.findIndex(col => col.id === over.id)

      if (currentColumnIndex !== newIndex) {
        setCurrentColumnIndex(newIndex)
        // setColumns(arrayMove(columns, oldIndex, newIndex))
      }
    }
  }

  const handleTaskCompletion = (taskId: string) => {
    setItem(prevItem => ({
      ...prevItem,
      tasks: prevItem.tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }))

    setColumns(prevColumns => {
      return prevColumns.map(column => ({
        ...column,
        tasks: column.tasks.map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      }))
    })
  }

  const currentProgress = (currentColumnIndex / (columns.length - 1)) * 100

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <Card className="w-full max-w-7xl mx-auto bg-white">
        <CardHeader className="bg-black text-white">
          <CardTitle>Progreso del Ítem</CardTitle>
          <Progress value={currentProgress} className="w-full bg-white [&>div]:bg-orange-500" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {columns.map((column, index) => (
              <Column key={column.id} column={column} isActive={index === currentColumnIndex}>
                {index === currentColumnIndex && (
                  <Item
                    item={item}
                    onTaskCompletion={handleTaskCompletion}
                  />
                )}
              </Column>
            ))}
          </div>
        </CardContent>
      </Card>
    </DndContext>
  )
}