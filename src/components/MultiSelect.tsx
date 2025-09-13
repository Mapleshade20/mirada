import { Check, Search, X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/glass-button";
import { GlassCard } from "./ui/glass-card";
import { Input } from "./ui/input";

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder?: string;
  maxSelections?: number;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onSelectionChange,
  placeholder = "Select options...",
  maxSelections,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onSelectionChange(selected.filter((item) => item !== option));
    } else if (!maxSelections || selected.length < maxSelections) {
      onSelectionChange([...selected, option]);
    }
  };

  const removeSelected = (optionToRemove: string) => {
    onSelectionChange(selected.filter((item) => item !== optionToRemove));
  };

  return (
    <div className="relative">
      {/* Selected Items Display */}
      <div
        className="min-h-[40px] p-3 bg-muted/50 border border-border/50 rounded-md cursor-pointer flex flex-wrap gap-2 items-center"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        role="button"
        tabIndex={0}
      >
        {selected.length === 0 ? (
          <span className="text-muted-foreground">{placeholder}</span>
        ) : (
          selected.map((item) => (
            <Badge
              key={item}
              variant="secondary"
              className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30"
            >
              {item}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSelected(item);
                }}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        )}
        <Search className="h-4 w-4 text-muted-foreground ml-auto" />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <GlassCard className="absolute top-full left-0 right-0 z-50 mt-1 p-4 max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="mb-3">
            <Input
              placeholder="Search options..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-muted/50 border-border/50"
            />
          </div>

          {/* Max selections warning */}
          {maxSelections && selected.length >= maxSelections && (
            <div className="mb-3 text-sm text-muted-foreground text-center">
              Maximum {maxSelections} selections reached
            </div>
          )}

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto space-y-2">
            {filteredOptions.map((option) => {
              const isSelected = selected.includes(option);
              const isDisabled =
                maxSelections &&
                selected.length >= maxSelections &&
                !isSelected;

              return (
                <div
                  key={option}
                  className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors ${
                    isDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-muted/30"
                  }`}
                  onClick={() => !isDisabled && toggleOption(option)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      !isDisabled && toggleOption(option);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <Checkbox
                    checked={isSelected}
                    disabled={isDisabled}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="text-sm">{option}</span>
                  {isSelected && (
                    <Check className="h-4 w-4 text-primary ml-auto" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Selection Counter */}
          <div className="mt-3 flex justify-between items-center text-sm text-muted-foreground">
            <span>
              {selected.length} selected
              {maxSelections ? ` / ${maxSelections}` : ""}
            </span>
            <Button onClick={() => setIsOpen(false)} variant="ghost" size="sm">
              Close
            </Button>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
