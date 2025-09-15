import {
  BookOutlined,
  CloseOutlined,
  HeartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Modal, Tag } from "antd";
import type React from "react";
import { useTranslation } from "react-i18next";
import type { VetoPreview } from "../lib/api";
import { useTagTranslation } from "../utils/i18n-helpers";
import { translateGrade } from "../utils/validation";
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserOutlined className="text-blue-500" />
            <span>{candidate.email_domain}</span>
            <Tag color="blue">{translateGrade(candidate.grade, t)}</Tag>
          </div>
          {isVetoed && (
            <Tag color="red" icon={<CloseOutlined />}>
              {t("previews.vetoed")}
            </Tag>
          )}
        </div>
      }
      extra={
        <Button
          type={isVetoed ? "default" : "primary"}
          danger={!isVetoed}
          icon={isVetoed ? <HeartOutlined /> : <CloseOutlined />}
          onClick={handleVetoClick}
          loading={loading}
          size="small"
        >
          {isVetoed ? t("previews.approve") : t("previews.veto")}
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Recent Topics */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
            <BookOutlined />
            {t("previews.recentTopics")}
          </h4>
          <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
            {candidate.recent_topics}
          </p>
        </div>

        {/* Familiar Tags */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-2">
            {t("previews.familiarTags")}
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
            {t("previews.aspirationalTags")}
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
