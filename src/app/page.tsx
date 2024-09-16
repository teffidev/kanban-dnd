"use client";

import React from "react";
import KanbanBoard from "./components/KanbanBoard";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <KanbanBoard />
    </div>
  );
};

export default Home;