import { FC } from 'react';
import { cn } from '@/lib/utils';

interface FormErrorProps {
  message?: string;
  className?: string;
}

const FormError: FC<FormErrorProps> = ({ message, className }) => {
  if (!message) return null;
  return <p className={cn("text-red-500 text-xs", className)}>{message}</p>;
};

export default FormError;