import React, { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/glass-button";
import { Input } from "./ui/input";
import { X, Plus, Search } from "lucide-react";
import { GlassCard } from "./ui/glass-card";

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
}

const predefinedTags = [
  // TODO: Change to what's in tags.json
  "Volunteering",
  "Debate",
  "Public Speaking",
  "Networking",
  "Leadership",
];

export const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onTagsChange,
  placeholder = "Select tags...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customTag, setCustomTag] = useState("");

  const filteredTags = predefinedTags.filter(
    (tag) =>
      tag.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedTags.includes(tag),
  );

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      addTag(customTag.trim());
      setCustomTag("");
    }
  };

  return (
    <div className="relative">
      {/* Selected Tags Display */}
      <div
        className="min-h-[40px] p-3 bg-muted/50 border border-border/50 rounded-md cursor-pointer flex flex-wrap gap-2 items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedTags.length === 0 ? (
          <span className="text-muted-foreground">{placeholder}</span>
        ) : (
          selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30"
            >
              {tag}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tag);
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
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-muted/50 border-border/50"
            />
          </div>

          {/* Custom Tag Input */}
          <div className="mb-3 flex gap-2">
            <Input
              placeholder="Add custom tag..."
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addCustomTag()}
              className="bg-muted/50 border-border/50 flex-1"
            />
            <Button
              onClick={addCustomTag}
              disabled={!customTag.trim()}
              variant="glass"
              size="sm"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Predefined Tags */}
          <div className="max-h-48 overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {filteredTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/20 hover:border-primary/50 transition-colors"
                  onClick={() => addTag(tag)}
                >
                  {tag}
                  <Plus className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-3 text-center">
            <Button onClick={() => setIsOpen(false)} variant="ghost" size="sm">
              Close
            </Button>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
