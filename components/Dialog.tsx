import React from "react";
import {
  Dialog as DialogPrimitive,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  triggerContent: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const Dialog = ({
  isOpen,
  setIsOpen,
  triggerContent,
  title,
  children,
}: DialogProps) => {
  return (
    <DialogPrimitive open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerContent}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </DialogPrimitive>
  );
};

export default Dialog;
