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
    title: "Revisión de documentos",
    tasks: [
      {
        id: "1",
        content: "Factura comercial",
      },
      {
        id: "2",
        content: "Lista de empaque",
      },
      {
        id: "3",
        content: "Shipping Mark",
      },
      {
        id: "4",
        content: "Datos comerciales",
      },
      {
        id: "5",
        content: "Credenciales Ecuapass",
      },
      {
        id: "6",
        content: "RUC",
      },
      {
        id: "7",
        content: "PDF - Cédula, Papeleta de votación",
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
      },
      {
        id: "11",
        content: "Enviar Email a cliente: ETA: APROX.",
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
      },
      {
        id: "16",
        content: "TARJA",
      },
      {
        id: "17",
        content: "CAS",
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
      },
      {
        id: "19",
        content: "Documento de Aforo",
      },
      {
        id: "20",
        content: "Registro de posesionamiento (Físico)",
      },
      {
        id: "21",
        content: "Registro fotográfico (Aforo físico)",
      },
      {
        id: "22",
        content: "Observaciones",
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
    <div className="mx-auto max-w-7xl py-10 px-3 sm:px-6 lg:px-8 bg-white">
      {/* Add item Modal */}
      <ModalAddItem
        showModal={showAddItemModal}
        setShowModal={setShowAddItemModal}>
        <div className="flex flex-col w-full items-start gap-y-4">
          <h1 className="text-gray-800 text-xl font-bold">
            Agregar nuevo ítem
          </h1>
          <input
            type="text"
            placeholder="Escribe aquí el nuevo ítem"
            name="itemname"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="border p-2 w-full rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
          <button
            onClick={onAddItem}
            className="px-4 py-2 shadow-lg bg-orange-600 text-white rounded-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
            Agregar
          </button>
        </div>
      </ModalAddItem>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onAddItem={() => handleAddItemClick(column.id)}
              onDeleteItem={handleDeleteItem}
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
