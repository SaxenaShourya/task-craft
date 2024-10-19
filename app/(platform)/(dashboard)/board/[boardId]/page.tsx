import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import ListContainer from "@/components/Lists/ListContainer"

const BoardPage = async ({params}: {params: {boardId: string}}) => {
  const {orgId} = auth()
  if(!orgId) {
    redirect("/sign-in")
  }

  const lists = await db.list.findMany({
    where: {
      boardId: params.boardId,
      board: {
        orgId
      }
    },
    include: {
      cards: {
        orderBy: {
          order: "asc"
        }
      }
    },
    orderBy: {
      order: "asc"
    }
  })

  return (
    <div>
      <ListContainer data={lists}/>
    </div>
  )
}

export default BoardPage