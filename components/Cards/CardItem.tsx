import React, { useState } from 'react'
import { Card, List } from '@prisma/client'

import AddCard from './AddCard'
import CardDialog from './CardDialog'

const CardItem = ({ data, cardsCount }: { data: { cards: Card[] } & List, cardsCount: number }) => {
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2 py-2 px-3 bg-white rounded-b-md">
       {data.cards.map((card) => (
        <CardDialog
          key={card.id}
          card={card}
          isOpen={openCardId === card.id}
          setIsOpen={(isOpen) => setOpenCardId(isOpen ? card.id : null)}
          listName={data.title}
          cardsCount={cardsCount}
        />
      ))}
      <AddCard listId={data.id} cardsCount={cardsCount} />
    </div>
  );
}

export default CardItem;
