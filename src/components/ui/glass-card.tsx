import * as React from "react";
import { cn } from "@/lib/utils";

interface PefaCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const PefaCard = React.forwardRef<HTMLDivElement, PefaCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("pefa-card p-8", className)} {...props}>
        {children}
      </div>
    );
  },
);

PefaCard.displayName = "PefaCard";

// Keep GlassCard as alias for backward compatibility
const GlassCard = PefaCard;

export { PefaCard, GlassCard };
