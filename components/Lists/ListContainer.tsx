import React from 'react'
import { List, Card } from '@prisma/client'

const ListContainer = ({data, boardId}: {data: ({cards: Card[]} & List)[] , boardId: string}) => {
  return (
    <div>
        List Container
    </div>
  )
}

export default ListContainer