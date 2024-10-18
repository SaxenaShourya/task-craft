import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { updateBoard } from '@/actions/editBoard/action';
import { UpdateBoardSchema, InputType } from '@/actions/editBoard/types';
import { useRouter } from 'next/navigation';

import { useAction } from '@/hooks/use-action';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import FormError from '../FormError';
import Spinner from '../Spinner';

interface EditTitleProps {
  boardId: string;
  boardTitle: string;
  setIsOpen: (isOpen: boolean) => void;
}

const EditTitle: React.FC<EditTitleProps> = ({ boardId, boardTitle, setIsOpen }) => {
  const { toast } = useToast();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<InputType>({
    resolver: zodResolver(UpdateBoardSchema),
    defaultValues: {
      id: boardId,
      title: boardTitle,
    },
  });

  const { execute, fieldErrors, isLoading } = useAction(updateBoard, {
    onSuccess: () => {
      toast({
        title: "Board updated",
        description: "The board title has been successfully updated.",
        variant: "default",
      });
      setIsOpen(false);
      router.refresh();
    },
    onError: (error) => {
      toast({
        title: error.title,
        description: error.description,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InputType) => {
    execute(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register("title")}
        placeholder="Enter new board title"
        disabled={isLoading}
      />
      {fieldErrors?.title && (
        <FormError message={fieldErrors.title[0]} />
      )}
      {!fieldErrors?.title && errors.title?.message && (
        <FormError message={errors.title.message} />
      )}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Spinner /> : "Save"}
        </Button>
      </div>
    </form>
  )
}

export default EditTitle