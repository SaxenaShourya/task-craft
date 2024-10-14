"use client";

import { useState } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Spinner from "@/components/Spinner";
import { FaGithub, FaGoogle } from "react-icons/fa";
import ForgotPasswordModal from "@/components/Login/ForgetPasswordModal";
import FormError from "@/components/FormError";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

import {
  IoEyeOffOutline as EyeSlash,
  IoEyeOutline as Eye,
} from "react-icons/io5";
import Link from "next/link";

const loginSchema = z.object({
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

type TLoginSchema = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState<"github" | "google" | false>(false);

  const { isLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: isSignInLoaded } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp: signUpOAuth } = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center size-full">
        <Spinner variant="dark" />
      </div>
    );
  }

  const handleOAuthSignIn = async (
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


  const onSubmit = async (data: TLoginSchema) => {
    
    try {
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        console.error("Sign-in incomplete", result);
        toast({
          title: "Login Incomplete",
          description: "Please complete the sign-in process.",
          variant: "destructive",
        });
      }
    } catch (err) {
      const error = err as { errors?: { message: string }[] };
      console.log("Error during login:", error?.errors?.[0]?.message);
      toast({
        title: "Login Failed",
        description:
          error?.errors?.[0]?.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold">
            Login to Task Craft
          </CardTitle>
          <CardDescription>
            Enter your email and password to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 !pb-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              size="lg"
              variant="outline"
              type="button"
              className="w-full"
              disabled={isSubmitting || isOAuthLoading === "github"}
              onClick={() => handleOAuthSignIn("oauth_github")}
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
              disabled={isSubmitting || isOAuthLoading === "google"}
              onClick={() => handleOAuthSignIn("oauth_google")}
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="text" {...register("email")} placeholder="Enter your email" disabled={isSubmitting} />
              <FormError message={errors.email?.message} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full pr-10"
                {...register("password")}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-primary transition-colors"
                disabled={isSubmitting}
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
            <div className="flex justify-end">
              <Button
                type="button"
                variant="link"
                className="px-0 font-normal"
                onClick={() => setIsForgotPasswordOpen(true)}
                disabled={isSubmitting}
              >
                Forgot password?
              </Button>
            </div>
            <Button type="submit" className="w-full !mt-0" disabled={isSubmitting}>
              {isSubmitting ? <Spinner className="mr-2 h-4 w-4" /> : null}
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-1 p-1">
        <div className="text-center font-medium text-sm my-2">
          <span className="mr-1 text-muted-foreground">
            Don&apos;t have an account?{" "}
          </span>
          <Link href="/sign-up" className="hover:underline">
            Sign Up
          </Link>
        </div>
      </CardFooter>
      </Card>
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </>
  );
};

export default LoginPage;
