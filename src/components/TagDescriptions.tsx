import type React from "react";
import { useTagTranslation } from "@/utils/i18n-helpers";

interface TagDescriptionsProps {
  tagIds: string[];
  className?: string;
  title?: string;
}

const TagDescriptions: React.FC<TagDescriptionsProps> = ({
  tagIds,
  className = "",
  title,
}) => {
  const { getTagName, getTagDesc } = useTagTranslation();

  // Filter tags that have descriptions
  const tagsWithDescriptions = tagIds
    .map((tagId) => ({
      id: tagId,
      name: getTagName(tagId),
      desc: getTagDesc(tagId),
    }))
    .filter((tag) => tag.desc);

  if (tagsWithDescriptions.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {title && <h4 className="text-xs font-medium text-gray-500">{title}</h4>}
      <div className="space-y-0.5">
        {tagsWithDescriptions.map((tag) => (
          <div
            key={tag.id}
            className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md"
          >
            <span className="font-medium">{tag.name}</span>: {tag.desc}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagDescriptions;
