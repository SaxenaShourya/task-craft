"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/router";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import Spinner from "../Spinner";
import FormError from "../FormError";
import { FaEnvelope } from "react-icons/fa";

const otpSchema = z.object({
  otp: z.string().length(6, { message: "Please enter all 6 digits" }),
});

type TOTPFormSchema = z.infer<typeof otpSchema>;

const VerificationStep = ({
  signUp,
  setActive,
}: {
  signUp: ReturnType<typeof useSignUp>["signUp"];
  setActive: ReturnType<typeof useSignUp>["setActive"];
}) => {
  const { toast } = useToast();
  const router = useRouter();

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TOTPFormSchema>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = async (data: TOTPFormSchema) => {
    try {
      const completeSignUp = await signUp?.attemptEmailAddressVerification({
        code: data.otp,
      });
      if (completeSignUp?.status !== "complete") {
        toast({
          title: "Error",
          description:
            "There was a problem with the sign up process. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (completeSignUp?.createdSessionId) {
        await setActive?.({ session: completeSignUp.createdSessionId });
        toast({
          title: "Success",
          description: "Your account has been verified successfully!",
        });
        router.push("/dashboard");
      }
    } catch (err) {
      const error = err as { errors?: { message: string }[] }
      console.log("Error verifying email:", error?.errors?.[0]?.message);
      toast({
        title: "Verification Failed",
        description:
          error?.errors?.[0]?.message ||
          "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <FaEnvelope className="mx-auto text-4xl text-primary mb-4" />
        <CardTitle className="text-2xl font-bold">
          Verify Your Account
        </CardTitle>
        <CardDescription className="mt-2 text-sm text-muted-foreground">
          We&apos;ve sent a 6-digit verification code to your email:{" "}
          <span className="font-medium text-primary">
            {signUp?.emailAddress}
          </span>
          . Enter the code below to complete your registration.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 flex flex-col justify-center items-center"
        >
          <div className="space-y-2 flex flex-col justify-center items-center">
            <Label htmlFor="otp" className="text-sm font-medium">
              Enter verification code
            </Label>
            <InputOTP
              maxLength={6}
              value={watch("otp")}
              onChange={(value) => setValue("otp", value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <FormError message={errors.otp?.message} />
          </div>
          <Button
            className="w-full max-w-xs mx-auto"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner className="size-5" /> : null}
            {isSubmitting ? "" : "Verify and Continue"}
          </Button>
        </form>
        <p className="text-sm text-center text-muted-foreground">
          Didn&apos;t receive the code?{" "}
          <Button variant="link" className="p-0 h-auto">
            Resend
          </Button>
        </p>
      </CardContent>
    </Card>
  );
};

export default VerificationStep;
