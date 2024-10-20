import React, { useState } from "react";
import { Card, List } from "@prisma/client";
import { Draggable, Droppable } from "@hello-pangea/dnd";

import AddCard from "./AddCard";
import CardDialog from "./CardDialog";

const CardItem = ({
  data,
  cardsCount,
}: {
  data: { cards: Card[] } & List;
  cardsCount: number;
}) => {
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  return (
    <Droppable droppableId={data.id} type="card">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="flex flex-col gap-2 py-2 px-3 bg-white rounded-b-md"
        >
          {data.cards.map((card, index) => (
            <Draggable key={card.id} draggableId={card.id} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <CardDialog
                    key={card.id}
                    card={card}
                    isOpen={openCardId === card.id}
                    setIsOpen={(isOpen) =>
                      setOpenCardId(isOpen ? card.id : null)
                    }
                    listName={data.title}
                    cardsCount={cardsCount}
                  />
                </div>
              )}
            </Draggable>
          ))}
           {provided.placeholder}
          <AddCard listId={data.id} cardsCount={cardsCount} />
        </div>
      )}
    </Droppable>
  );
};

export default CardItem;
