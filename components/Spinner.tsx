import { cn } from "@/lib/utils";

type SpinnerProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "light" | "dark";
};

const Spinner = ({ className, variant = "light", ...props }: SpinnerProps) => {
  return (
    <div
      className={cn(
        "inline-block h-6 w-6 animate-spin rounded-full border-[3px] ",
        {
          "border-primary-foreground ": variant === "light",
          "border-primary ": variant === "dark",
        },
        "border-t-transparent ",
        className
      )}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
