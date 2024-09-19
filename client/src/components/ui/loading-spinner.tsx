import { cn } from "@/lib/utils";
import { CircleNotch } from "@phosphor-icons/react";
import React from "react";

const spinnerVariants = "w-5 h-5 animate-spin";

interface LoadingSpinnerProps extends React.HTMLAttributes<SVGSVGElement> {
  className?: string;
}

const LoadingSpinner = React.forwardRef<SVGSVGElement, LoadingSpinnerProps>(
  (props, ref) => {
    const { className, ...rest } = props;
    return (
      <CircleNotch
        ref={ref}
        className={cn(spinnerVariants, className)}
        {...rest}
      />
    );
  },
);

LoadingSpinner.displayName = "LoadingSpinner";

export { LoadingSpinner };