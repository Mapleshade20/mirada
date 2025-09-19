import {
  BookOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  HeartOutlined,
  SmileOutlined,
  UpCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Modal, message, Tag } from "antd";
import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { UserProfile } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { useTagTranslation } from "../utils/i18n-helpers";
import { translateGrade } from "../utils/validation";
import AuthenticatedImage from "./AuthenticatedImage";
import TagDescriptions from "./TagDescriptions";

interface FinalMatchCardProps {
  finalMatch: NonNullable<UserProfile["final_match"]>;
  showActions?: boolean;
  showTitle?: boolean;
}

const FinalMatchCard: React.FC<FinalMatchCardProps> = ({
  finalMatch,
  showActions = true,
  showTitle = true,
}) => {
  const { t } = useTranslation();
  const { acceptMatch, rejectMatch } = useAuthStore();
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const { getTagName } = useTagTranslation();

  const handleAccept = () => {
    Modal.confirm({
      title: t("finalMatch.acceptConfirm.title"),
      content: t("finalMatch.acceptConfirm.content"),
      okText: t("finalMatch.acceptConfirm.confirm"),
      cancelText: t("finalMatch.acceptConfirm.cancel"),
      okType: "primary",
      onOk: async () => {
        try {
          setIsAccepting(true);
          await acceptMatch();
          message.success(t("finalMatch.acceptSuccess"));
        } catch (_error) {
          message.error(t("finalMatch.acceptError"));
        } finally {
          setIsAccepting(false);
        }
      },
    });
  };

  const handleReject = () => {
    Modal.confirm({
      title: t("finalMatch.rejectConfirm.title"),
      content: t("finalMatch.rejectConfirm.content"),
      okText: t("finalMatch.rejectConfirm.confirm"),
      cancelText: t("finalMatch.rejectConfirm.cancel"),
      okType: "danger",
      onOk: async () => {
        try {
          setIsRejecting(true);
          await rejectMatch();
          message.success(t("finalMatch.rejectSuccess"));
        } catch (_error) {
          message.error(t("finalMatch.rejectError"));
        } finally {
          setIsRejecting(false);
        }
      },
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      {showTitle && (
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">💕</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {t("finalMatch.title")}
          </h2>
          <p className="text-gray-600">{t("finalMatch.subtitle")}</p>
        </div>
      )}

      <div
        className={`bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6 ${showActions ? "mb-6" : "mb-0"}`}
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Content Section - Left 2/3 on desktop */}
          <div className="flex-1 md:flex-[2] order-2 md:order-1">
            <div className="flex items-center gap-2 mb-4">
              <UserOutlined className="text-blue-500" />
              <span className="font-medium">{finalMatch.email_domain}</span>
              <Tag color="blue">{translateGrade(finalMatch.grade, t)}</Tag>
            </div>

            {/* Self Introduction */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                <BookOutlined /> {t("finalMatch.selfIntro")}
              </h4>
              <p className="text-gray-800 bg-white p-3 rounded-lg border border-gray-200">
                {finalMatch.self_intro}
              </p>
            </div>

            {/* Recent Topics */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                <ClockCircleOutlined /> {t("finalMatch.recentTopics")}
              </h4>
              <p className="text-gray-800 bg-white p-3 rounded-lg border border-gray-200">
                {finalMatch.recent_topics}
              </p>
            </div>

            {/* Familiar Tags */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                <SmileOutlined /> {t("finalMatch.familiarTags")}
              </h4>
              <div className="flex flex-wrap gap-1 mb-2">
                {finalMatch.familiar_tags.map((tagId) => (
                  <Tag key={tagId} color="green">
                    {getTagName(tagId)}
                  </Tag>
                ))}
              </div>
              <TagDescriptions
                tagIds={finalMatch.familiar_tags}
                className="mt-2"
              />
            </div>

            {/* Aspirational Tags */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                <UpCircleOutlined /> {t("finalMatch.aspirationalTags")}
              </h4>
              <div className="flex flex-wrap gap-1 mb-2">
                {finalMatch.aspirational_tags.map((tagId) => (
                  <Tag key={tagId} color="orange">
                    {getTagName(tagId)}
                  </Tag>
                ))}
              </div>
              <TagDescriptions
                tagIds={finalMatch.aspirational_tags}
                className="mt-2"
              />
            </div>
          </div>

          {/* Photo Section - Right 1/3 on desktop, top on mobile */}
          <div className="flex-1 md:flex-[1] order-1 md:order-2 flex justify-center md:justify-end">
            <div className="w-full max-w-xs md:max-w-none">
              <AuthenticatedImage
                src={finalMatch.photo_url}
                alt="Partner profile photo"
                className="w-full h-48 md:h-64 object-cover rounded-lg shadow-md"
                fallbackIcon={<UserOutlined />}
                useAvatar={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex gap-4 justify-center">
          <Button
            type="default"
            danger
            size="large"
            icon={<CloseOutlined />}
            onClick={handleReject}
            loading={isRejecting}
            className="flex-1 max-w-xs h-12"
          >
            {t("finalMatch.rejectButton")}
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<HeartOutlined />}
            onClick={handleAccept}
            loading={isAccepting}
            className="flex-1 max-w-xs h-12"
          >
            {t("finalMatch.acceptButton")}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default FinalMatchCard;
