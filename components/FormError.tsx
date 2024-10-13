import { FC } from 'react';

interface FormErrorProps {
  message?: string;
}

const FormError: FC<FormErrorProps> = ({ message }) => {
  if (!message) return null;
  return <p className="text-red-500 text-xs">{message}</p>;
};

export default FormError;