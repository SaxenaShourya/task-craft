import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "@/hooks/use-action";
import { createBoard } from "@/actions/Boards/createBoard/action";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  CreateBoardSchema,
  InputType,
} from "@/actions/Boards/createBoard/types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";

import ImgPicker from "./ImgPicker";
import Spinner from "../Spinner";
import FormError from "../FormError";

interface DialogFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const DialogForm: React.FC<DialogFormProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { toast } = useToast();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
  } = useForm<InputType>({
    resolver: zodResolver(CreateBoardSchema),
    defaultValues: {
      title: "",
      image: {
        id: "",
        urls: {
          thumb: "",
          full: "",
        },
        author: "",
        links: {
          html: "",
        },
      },
    },
  });

  const {
    execute,
    fieldErrors,
    isLoading: isSubmitting,
  } = useAction(createBoard, {
    onSuccess: (data) => {
      toast({
        title: data.success,
        description: data.description,
        variant: "default",
      });
      reset();
      onClose();
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

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new board</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1">
            <Label htmlFor="title">Board title</Label>
            <div className="space-y-2">
              <Input
                id="title"
                placeholder="Enter board title"
                {...register("title")}
                disabled={isSubmitting}
              />
              {fieldErrors?.title && (
                <FormError message={fieldErrors.title[0]} />
              )}
              {!fieldErrors?.title && errors.title?.message && (
                <FormError message={errors.title.message} />
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Board image</Label>
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <ImgPicker
                  onChange={(image) => field.onChange(image)}
                  value={field.value}
                  error={
                    errors.image?.id?.message ||
                    errors.image?.message ||
                    fieldErrors?.image?.[0]
                  }
                />
              )}
            />
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogForm;
