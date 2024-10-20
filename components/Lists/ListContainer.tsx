"use client"
import React, { useState, useEffect } from 'react'
import { List, Card } from '@prisma/client'

import ListItem from './ListItem'
import CardItem from '../Cards/CardItem'

const ListContainer = ({ data }: { data: ({ cards: Card[] } & List)[]}) => {
  const [orderedData, setOrderedData] = useState(data)

  useEffect(() => {
    setOrderedData(data)
  }, [data])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 h-full overflow-x-auto px-4 py-2">
      {orderedData.slice(0, 4).map((list) => (
        <div className='flex flex-col w-full min-w-[250px]' key={list.id}>
          <ListItem data={list} listCount={orderedData.length} />
          <CardItem data={list} cardsCount={list.cards.length} />
        </div>
      ))}
    </div>
  )
}

export default ListContainer