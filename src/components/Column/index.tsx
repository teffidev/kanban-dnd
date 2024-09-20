"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";

type ColumnProps = {
  column: {
    id: string;
    title: string;
  };
  isActive: boolean;
  children?: React.ReactNode;
};

export default function Column({ column, isActive, children }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`p-4 bg-gray-100 rounded-lg ${
        isActive ? "ring-2 ring-orange-500" : ""
      }`}>
      <h2 className="text-lg font-semibold mb-4 text-black">{column.title}</h2>
      {isActive && children}
    </div>
  );
}
