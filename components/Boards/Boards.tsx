import React from "react";
import Link from "next/link";
import { Board } from "@prisma/client";

interface BoardsProps {
  boards: Board[];
}

const Boards: React.FC<BoardsProps> = ({ boards }) => {
  if (boards.length === 0) {
    return null;
  }

  return (
    boards.map((board) => (
      <Link
        key={board.id}
        href={`/board/${board.id}`}
        className="group relative aspect-video bg-no-repeat bg-center bg-cover rounded-lg h-full w-full p-4 overflow-hidden shadow-sm transition-all duration-300 hover:opacity-80"
        style={{
          backgroundImage: `url(${board.imageThumbUrl})`,
        }}
      >
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-opacity duration-300" />
        <div className="relative z-10 flex flex-col h-full justify-between">
          <p className="bg-white/30 backdrop-blur-sm rounded px-1 py-0.5 self-start text-xs font-semibold text-white text-shadow">
            {board.title}
          </p>
          <div className="self-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-neutral-100 text-neutral-700 text-xs font-medium px-2 py-1 rounded">
              View Board
            </span>
          </div>
        </div>
      </Link>
    ))
  );
};

export default Boards;
