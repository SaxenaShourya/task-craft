import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, Plus } from "lucide-react";

interface CreateCardProps {
  onClick: () => void;
  remainingBoards: number;
}

const CreateCard: React.FC<CreateCardProps> = ({ onClick, remainingBoards }) => {
  return (
    <div 
    className={`aspect-video relative h-full w-full bg-neutral-100 transition rounded-lg shadow-sm flex flex-col items-center justify-center group p-6 border-2 border-dashed border-neutral-300 ${
      remainingBoards > 0 ? 'hover:bg-neutral-200 hover:border-neutral-400 hover:cursor-pointer' : 'opacity-50 cursor-not-allowed'
    }`}
    onClick={remainingBoards > 0 ? onClick : undefined}
    >
      <Plus className="h-12 w-12 text-neutral-500 group-hover:text-neutral-600 transition mb-4" />

      <p className="text-sm font-semibold mb-2 text-neutral-700">
        Create new board
      </p>

      <p className="text-xs text-neutral-500 mb-4">{remainingBoards} remaining</p>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="h-5 w-5 absolute bottom-3 right-3 text-neutral-400 hover:text-neutral-500 transition" />
          </TooltipTrigger>

          <TooltipContent
            side="left"
            align="end"
            className="bg-white p-4 rounded-md shadow-lg max-w-xs"
          >
            <p className="text-sm text-neutral-700 leading-relaxed">
              You can create up to 4 boards on the free trial. <Link href="https://www.linkedin.com/in/shouryasaxena" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Contact me on LinkedIn</Link> for more details.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default CreateCard;
