"use client";

import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Spinner from "../Spinner";
import FormError from "../FormError";
import { FaUser } from "react-icons/fa";

const usernameSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must not exceed 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
});

type TUsernameSchema = z.infer<typeof usernameSchema>;

const UsernameStep = ({
  signUp,
  setStep,
}: {
  signUp: ReturnType<typeof useSignUp>["signUp"];
  setStep: Dispatch<SetStateAction<"start" | "username" | "verification">>;
}) => {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TUsernameSchema>({
    resolver: zodResolver(usernameSchema),
  });

  const onSubmit = async (data: TUsernameSchema) => {
    try {
      await signUp?.update({
        username: data.username,
      });
      setStep("verification");
      toast({
        title: "Success",
        description: "Username set successfully. Please verify your email.",
      });
    } catch (err) {
      const error = err as { errors?: { message: string }[] }
      console.log("Error setting username:", error?.errors?.[0]?.message);
      toast({
        title: "Username Setup Failed",
        description:
          error?.errors?.[0]?.message ||
          "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full sm:w-96">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Choose Your Username</CardTitle>
        <CardDescription>
          Pick a unique identifier for your TaskCraft journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                {...register("username")}
                className="pl-10"
                placeholder="Enter your username"
                disabled={isSubmitting}
              />
            </div>
            <FormError message={errors.username?.message} />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Spinner className="size-4" /> : null}
            {isSubmitting ? "" : "Continue to Verification"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <p className="text-xs text-center text-muted-foreground">
          Your username will be visible to other{" "}
          <span className="font-medium text-primary">
            &quot;TaskCraft&quot;
          </span>{" "}
          users
        </p>
      </CardFooter>
    </Card>
  );
};

export default UsernameStep;
