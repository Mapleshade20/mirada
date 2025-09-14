import type React from "react";
import { Novatrix } from "uvcanvas";

interface BackgroundProps {
  opacity?: number;
  className?: string;
}

const NovatrixBackground: React.FC<BackgroundProps> = ({
  opacity = 0.5,
  className = "",
}) => {
  return (
    <div className={`absolute inset-0 z-0 ${className}`}>
      <div style={{ opacity }} className="w-full h-full">
        <Novatrix />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-background/60 via-background/80 to-background/90" />
    </div>
  );
};

export default NovatrixBackground;
