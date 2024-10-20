"use client";
import React, { useState, useEffect } from "react";
import { List, Card } from "@prisma/client";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/Lists/updateOrder/action";
import { updateCardPosition } from "@/actions/Cards/updateOrder/action";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import ListItem from "./ListItem";
import CardItem from "../Cards/CardItem";


const ListContainer = ({ data }: { data: ({ cards: Card[] } & List)[] }) => {
  const [orderedData, setOrderedData] = useState(data);
  const params = useParams();
  const { toast } = useToast();

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast({ title: "Lists reordered" });
    },
    onError: (error) => {
      toast({ title: error.title, description: error.description, variant: "destructive" });
    },
  });

  const { execute: executeUpdateCardPosition } = useAction(updateCardPosition, {
    onSuccess: () => {
      toast({ title: "Card moved" });
    },
    onError: (error) => {
      toast({ title: error.title, description: error.description, variant: "destructive" });
    },
  });

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
  
    if (!destination) {
      return;
    }
  
    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
  
    // User moves a list
    if (type === "list") {
      const reorderedItems = orderedData.slice();
      const [reorderedItem] = reorderedItems.splice(source.index, 1);
      reorderedItems.splice(destination.index, 0, reorderedItem);
      const updatedItems = reorderedItems.map((item, index) => ({...item, order: index}));
  
      setOrderedData(updatedItems);

      // Server Action
      executeUpdateListOrder({
        items: updatedItems.map(({ id, order }) => ({ id, order })),
        boardId: params.boardId as string,
      });
    }
  
    // User moves a card
    if (type === "card") {
      const sourceList = orderedData.find(list => list.id === source.droppableId);
      const destList = orderedData.find(list => list.id === destination.droppableId);
      
      if (!sourceList || !destList) {
        return;
      }
  
      // Moving within the same list
      if (source.droppableId === destination.droppableId) {
        const newCards = Array.from(sourceList.cards);
        const [movedCard] = newCards.splice(source.index, 1);
        newCards.splice(destination.index, 0, movedCard);
  
        const newList = {
          ...sourceList,
          cards: newCards,
        };
  
        setOrderedData(prev => 
          prev.map(list => list.id === newList.id ? newList : list)
        );

        // Server Action
        executeUpdateCardPosition({
          items: newCards.map((card, index) => ({ id: card.id, order: index, listId: sourceList.id })),
          boardId: params.boardId as string,
        });
      } 
      // Moving to another list
      else {
        const sourceCards = Array.from(sourceList.cards);
        const [movedCard] = sourceCards.splice(source.index, 1);
        const destinationCards = Array.from(destList.cards);
        destinationCards.splice(destination.index, 0, movedCard);
  
        setOrderedData(prev => 
          prev.map(list => {
            if (list.id === sourceList.id) {
              return { ...list, cards: sourceCards };
            }
            if (list.id === destList.id) {
              return { ...list, cards: destinationCards };
            }
            return list;
          })
        );

        // Server Action
        executeUpdateCardPosition({
          items: [
            ...sourceCards.map((card, index) => ({ id: card.id, order: index, listId: sourceList.id })),
            ...destinationCards.map((card, index) => ({ id: card.id, order: index, listId: destList.id }))
          ],
          boardId: params.boardId as string,
        });
      }
    }
  };

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 h-full overflow-x-auto px-4 py-2"
          >
            {orderedData.slice(0, 4).map((list, index) => (
              <Draggable key={list.id} draggableId={list.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="flex flex-col w-full min-w-[250px]"
                  >
                    <div {...provided.dragHandleProps}>
                      <ListItem data={list} listCount={orderedData.length} />
                    </div>
                    <CardItem data={list} cardsCount={list.cards.length} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ListContainer;
