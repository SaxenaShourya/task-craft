import React from "react";
import { useParams } from "next/navigation";
import { useAction } from "@/hooks/use-action";
import { copyList } from "@/actions/Lists/copyList/action";
import { useToast } from "@/hooks/use-toast";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Copy } from "lucide-react";
import Spinner from "../Spinner";

const CopyList = ({ listId, listCount }: { listId: string, listCount: number }) => {
  const params = useParams();
  const { toast } = useToast();

  const { execute, isLoading } = useAction(copyList, {
    onSuccess: (data) => {
      toast({
        title: "List copied",
        description: `The list "${data.title}" has been successfully copied.`,
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: error.title,
        description: error.description,
        variant: "destructive",
      });
    },
  });

  const handleCopy = (event: React.MouseEvent) => {
    event.preventDefault();
    execute({ id: listId, boardId: params.boardId as string });
  };

  return (
    <DropdownMenuItem
      className="flex items-center py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
      onClick={handleCopy}
      disabled={isLoading || listCount >= 4}
    >
      {isLoading ? (
        <Spinner className="mr-2" variant="dark" />
      ) : (
        <Copy className="text-foreground/90 mr-2" />
      )}
      <span className="text-foreground">
        {isLoading ? "Copying..." : "Copy List"}
      </span>
    </DropdownMenuItem>
  );
};

export default CopyList;
