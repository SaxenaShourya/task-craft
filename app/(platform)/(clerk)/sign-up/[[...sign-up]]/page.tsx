"use client";

import { useState } from 'react';
import { useSignUp } from "@clerk/nextjs";
import StartStep from '@/components/SignUp/StartStep';
import UsernameStep from '@/components/SignUp/UsernameStep';
import VerificationStep from '@/components/SignUp/VerificationStep';
import Spinner from '@/components/Spinner';

const SignUpPage = () => {
  const [step, setStep] = useState<"start" | "username" | "verification">("start");
  const { isLoaded, signUp, setActive } = useSignUp();

  if (!isLoaded) {
    return <div className="flex justify-center items-center size-full"><Spinner variant="dark" /></div>
  }

  return (
    <div>
      {step === "start" && <StartStep signUp={signUp} setStep={setStep} />}
      {step === "username" && <UsernameStep signUp={signUp} setStep={setStep} />}
      {step === "verification" && <VerificationStep signUp={signUp} setActive={setActive} />}
    </div>
  );
};

export default SignUpPage;