"use client";

import { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp, useSignIn } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "@radix-ui/react-label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Spinner from "../Spinner";
import FormError from "../FormError";
import { FaGithub, FaGoogle } from "react-icons/fa";
import {
  IoEyeOffOutline as EyeSlash,
  IoEyeOutline as Eye,
} from "react-icons/io5";

const signUpSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }
    ),
});

type TSignUpSchema = z.infer<typeof signUpSchema>;

const StartStep = ({
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
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });
  const [showPassword, setShowPassword] = useState(false);

  const { isLoaded: isSignUpLoaded, signUp: signUpOAuth } = useSignUp();
  const { isLoaded: isSignInLoaded } = useSignIn();
  const [isOAuthLoading, setIsOAuthLoading] = useState<"github" | "google" | false>(false);

  const handleOAuthSignUp = async (
    strategy: "oauth_github" | "oauth_google"
  ) => {
    if (!isSignUpLoaded || !isSignInLoaded) {
      toast({
        title: "Error",
        description: "Authentication is not ready. Please try again.",
        variant: "destructive",
      });
      return;
    }
    setIsOAuthLoading(strategy === "oauth_github" ? "github" : "google");
    try {
      const response = await signUpOAuth.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
      console.log('OAuth response:', response);
    } catch (err) {
      const error = err as { errors?: { message: string }[] };
      console.log(`Error during ${strategy} sign in:`, error?.errors?.[0]?.message);
      toast({
        title: "Sign In Failed",
        description: error?.errors?.[0]?.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsOAuthLoading(false);
    }
  };

  const onSubmit = async (data: TSignUpSchema) => {
    try {
      await signUp?.create({
        emailAddress: data.email,
        password: data.password,
      });
      await signUp?.prepareEmailAddressVerification({ strategy: "email_code" });
      setStep("username");
      toast({
        title: "Success",
        description: "Account created successfully. Please set your username.",
      });
    } catch (err) {
      const error = err as { errors?: { message: string }[] };
      console.log("Error during sign up:", error?.errors?.[0]?.message);
      toast({
        title: "Sign Up Failed",
        description:
        error?.errors?.[0]?.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center p-2 mt-3">
        <CardTitle className="text-2xl font-semibold">
          Welcome to TaskCraft
        </CardTitle>
        <CardDescription className="mt-1 text-sm text-muted-foreground">
          Streamline your tasks and boost productivity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            size="lg"
            variant="outline"
            type="button"
            className="w-full"
            disabled={!isSignUpLoaded || isOAuthLoading === "github"}
            onClick={() => handleOAuthSignUp("oauth_github")}
          >
            {isOAuthLoading === "github" ? (
              <Spinner className="size-5" variant="dark" />
            ) : (
              <>
                <FaGithub className="mr-2 size-5" />
                GitHub
              </>
            )}
          </Button>
          <Button
            size="lg"
            variant="outline"
            type="button"
            className="w-full"
            disabled={!isSignUpLoaded || isOAuthLoading === "google"}
            onClick={() => handleOAuthSignUp("oauth_google")}
          >
            {isOAuthLoading === "google" ? (
              <Spinner className="size-5" variant="dark" />
            ) : (
              <>
                <FaGoogle className="mr-2 size-5" />
                Google
              </>
            )}
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm font-medium">
              Email address
            </Label>
            <Input
              id="email"
              type="text"
              placeholder="Enter your email"
              className="w-full"
              {...register("email")}
              disabled={isSubmitting}
            />
            <FormError message={errors.email?.message} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                className="w-full pr-10"
                {...register("password")}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-primary transition-colors"
              >
                {showPassword ? (
                  <EyeSlash className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <FormError message={errors.password?.message} />
          </div>
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner className="size-5" />
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-1 p-1">
        <div className="text-center font-medium text-sm my-2">
          <span className="mr-1 text-muted-foreground">
            Already have an account?{" "}
          </span>
          <Link href="/login" className="hover:underline">
            Log in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default StartStep;
