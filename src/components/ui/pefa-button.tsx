import * as React from "react";
import { cn } from "@/lib/utils";

interface PefaButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "outline";
  size?: "sm" | "md" | "lg";
}

const PefaButton = React.forwardRef<HTMLButtonElement, PefaButtonProps>(
  (
    { className, children, variant = "primary", size = "md", ...props },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pefa-peach focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: "pefa-button",
      outline: "pefa-button-outline",
    };

    const sizes = {
      sm: "text-sm px-4 py-2",
      md: "text-base px-6 py-3",
      lg: "text-lg px-8 py-4",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

PefaButton.displayName = "PefaButton";

export { PefaButton };
