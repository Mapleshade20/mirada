import {
  BookOutlined,
  CloseOutlined,
  HeartOutlined,
  SmileOutlined,
  UpCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Modal, Tag } from "antd";
import type React from "react";
import { useTranslation } from "react-i18next";
import type { VetoPreview } from "../lib/api";
import { useTagTranslation } from "../utils/i18n-helpers";
import { translateGrade } from "../utils/validation";
import AuthenticatedImage from "./AuthenticatedImage";
import TagDescriptions from "./TagDescriptions";

interface MatchCardProps {
  candidate: VetoPreview;
  isVetoed: boolean;
  onVeto: (candidateId: string) => void;
  onRevokeVeto: (candidateId: string) => void;
  loading?: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({
  candidate,
  isVetoed,
  onVeto,
  onRevokeVeto,
  loading = false,
}) => {
  const { t } = useTranslation();
  const { getTagName } = useTagTranslation();

  // Construct thumbnail URL path for AuthenticatedImage
  const thumbnailPath = `/api/images/thumbnail/${candidate.candidate_id}`;

  const handleVetoClick = () => {
    if (isVetoed) {
      onRevokeVeto(candidate.candidate_id);
    } else {
      Modal.confirm({
        title: t("previews.vetoConfirm.title"),
        content: t("previews.vetoConfirm.content"),
        okText: t("previews.vetoConfirm.confirm"),
        cancelText: t("previews.vetoConfirm.cancel"),
        okType: "danger",
        onOk: () => onVeto(candidate.candidate_id),
      });
    }
  };

  return (
    <Card
      className={`mb-4 transition-all duration-200 ${
        isVetoed ? "opacity-60 border-red-300 bg-red-50" : "hover:shadow-md"
      }`}
      title={
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <AuthenticatedImage
              src={thumbnailPath}
              alt={t("previews.profilePhoto")}
              size={64}
              fallbackIcon={<UserOutlined />}
              useAvatar={true}
              className="flex-shrink-0"
            />
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className="truncate">{candidate.email_domain}</span>
                <Tag color="blue" className="flex-shrink-0">
                  {translateGrade(candidate.grade, t)}
                </Tag>
                {isVetoed && (
                  <Tag
                    color="red"
                    icon={<CloseOutlined />}
                    className="ml-1 flex-shrink-0"
                  >
                    {t("previews.vetoed")}
                  </Tag>
                )}
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 ml-2">
            <Button
              type={isVetoed ? "default" : "primary"}
              danger={!isVetoed}
              icon={isVetoed ? <HeartOutlined /> : <CloseOutlined />}
              onClick={handleVetoClick}
              loading={loading}
              size="small"
            >
              <span className="hidden sm:inline ml-1">
                {isVetoed ? t("previews.approve") : t("previews.veto")}
              </span>
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Recent Topics */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
            <BookOutlined /> {t("previews.recentTopics")}
          </h4>
          <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
            {candidate.recent_topics}
          </p>
        </div>

        {/* Familiar Tags */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-2">
            <SmileOutlined /> {t("previews.familiarTags")}
          </h4>
          <div className="flex flex-wrap gap-1 mb-2">
            {candidate.familiar_tags.map((tagId) => (
              <Tag key={tagId} color="green">
                {getTagName(tagId)}
              </Tag>
            ))}
          </div>
          <TagDescriptions tagIds={candidate.familiar_tags} className="mt-2" />
        </div>

        {/* Aspirational Tags */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-2">
            <UpCircleOutlined /> {t("previews.aspirationalTags")}
          </h4>
          <div className="flex flex-wrap gap-1 mb-2">
            {candidate.aspirational_tags.map((tagId) => (
              <Tag key={tagId} color="orange">
                {getTagName(tagId)}
              </Tag>
            ))}
          </div>
          <TagDescriptions
            tagIds={candidate.aspirational_tags}
            className="mt-2"
          />
        </div>
      </div>
    </Card>
  );
};

export default MatchCard;
