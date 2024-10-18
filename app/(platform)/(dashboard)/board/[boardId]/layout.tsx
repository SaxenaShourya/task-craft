import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import BoardNavbar from "@/components/Boards/BoardNavbar";

export async function generateMetadata({
  params,
}: {
  params: { boardId: string };
}): Promise<Metadata> {
  const { orgId, orgSlug } = auth();

  if (!orgId) {
    return redirect('/create-org');
  }

  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId,
    },
  });

  if (!board) {
    notFound();
  }

  return {
    title: board.title ? `${board.title} - ${orgSlug}` : "Board",
  };
}

const BoardLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { boardId: string };
}) => {
  const { orgId } = auth();

  if (!orgId) {
    return redirect("/create-org");
  }

  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId,
    },
  });

  if (!board) {
    notFound();
  }

  return (
    <div 
    className="flex flex-col h-full w-full bg-cover bg-center bg-no-repeat" 
    style={{ backgroundImage: `url(${board.imageFullUrl})` }}
  >
    <BoardNavbar boardTitle={board.title} boardId={board.id} orgId={orgId} />
    <section>{children}</section>
  </div>
  );
};

export default BoardLayout;
