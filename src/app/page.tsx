"use client";

import KanbanBoard from "@/components/KanbanBoard";
import React from "react";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <KanbanBoard />
    </div>
  );
};

export default Home;