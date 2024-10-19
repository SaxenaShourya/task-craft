"use client"
import React, { useState, useEffect } from 'react'
import { List, Card } from '@prisma/client'

import ListItem from './ListItem'

const ListContainer = ({ data }: { data: ({ cards: Card[] } & List)[]}) => {
  const [orderedData, setOrderedData] = useState(data)

  useEffect(() => {
    setOrderedData(data)
  }, [data])

  return (
    <div className="flex flex-col sm:flex-row gap-3 h-full overflow-x-auto px-4 py-2">
      {orderedData.map((list) => (
        <ListItem key={list.id} data={list} />
      ))}
    </div>
  )
}

export default ListContainer