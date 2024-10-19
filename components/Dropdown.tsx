import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";

interface DropdownProps {
  children: React.ReactNode;
  contentClassName: string;
  btnClassName: string;
  iconClassName?: string;
}

const Dropdown = ({
  children,
  contentClassName,
  btnClassName,
  iconClassName,
}: DropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-auto w-auto p-2 transition focus-visible:ring-none focus-visible:ring-transparent focus-visible:ring-offset-0 ${btnClassName}`}
        >
          <MoreHorizontal
            className={`h-5 w-5 ${
              iconClassName ? iconClassName : "text-white"
            }`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={`w-56 ${contentClassName}`}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Dropdown;
