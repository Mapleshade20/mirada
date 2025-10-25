import { Heart, MessageCircle, User } from "lucide-react";
import type React from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTagTranslation, useTraitTranslation } from "../utils/i18n-helpers";
import TagDescriptions from "./TagDescriptions";

interface FormData {
  wechat_id?: string;
  gender?: "male" | "female";
  self_intro?: string;
  familiar_tags?: string[];
  aspirational_tags?: string[];
  self_traits?: string[];
  ideal_traits?: string[];
  physical_boundary?: number;
  recent_topics?: string;
  profile_photo_filename?: string;
}

interface FormReviewModalProps {
  open: boolean;
  onClose: () => void;
  formData: FormData | null;
}

const FormReviewModal: React.FC<FormReviewModalProps> = ({
  open,
  onClose,
  formData,
}) => {
  const { t } = useTranslation();
  const { getTagName } = useTagTranslation();
  const { getTraitName } = useTraitTranslation();

  if (!formData) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("dashboard.viewFormModal.title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              {t("profileForm.reviewModal.sections.personalInfo")}
            </h3>
            <div className="space-y-2 ml-7">
              {formData.wechat_id && (
                <div>
                  <span className="font-medium">
                    {t("profileForm.fields.wechatId.label")}:
                  </span>{" "}
                  {formData.wechat_id}
                </div>
              )}
              {formData.gender && (
                <div>
                  <span className="font-medium">
                    {t("profileForm.fields.gender.label")}:
                  </span>{" "}
                  {t(`profileForm.fields.gender.${formData.gender}`)}
                </div>
              )}
              {formData.self_intro && (
                <div>
                  <span className="font-medium">
                    {t("profileForm.fields.selfIntro.label")}
                  </span>
                  <div className="mt-1 p-3 bg-gray-50 rounded text-sm">
                    {formData.self_intro}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interests */}
          {(formData.familiar_tags || formData.aspirational_tags) && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                {t("profileForm.reviewModal.sections.interests")}
              </h3>
              <div className="space-y-3 ml-7">
                {formData.familiar_tags &&
                  formData.familiar_tags.length > 0 && (
                    <div>
                      <span className="font-medium">
                        {t("profileForm.fields.familiarTags.label")}:
                      </span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.familiar_tags.map((tagId) => (
                          <span
                            key={tagId}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                          >
                            {getTagName(tagId)}
                          </span>
                        ))}
                      </div>
                      <TagDescriptions
                        tagIds={formData.familiar_tags}
                        className="mt-3"
                      />
                    </div>
                  )}
                {formData.aspirational_tags &&
                  formData.aspirational_tags.length > 0 && (
                    <div>
                      <span className="font-medium">
                        {t("profileForm.fields.aspirationalTags.label")}:
                      </span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.aspirational_tags.map((tagId) => (
                          <span
                            key={tagId}
                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                          >
                            {getTagName(tagId)}
                          </span>
                        ))}
                      </div>
                      <TagDescriptions
                        tagIds={formData.aspirational_tags}
                        className="mt-3"
                      />
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Personality */}
          {(formData.self_traits || formData.ideal_traits) && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-purple-500" />
                {t("profileForm.reviewModal.sections.personality")}
              </h3>
              <div className="space-y-3 ml-7">
                {formData.self_traits && formData.self_traits.length > 0 && (
                  <div>
                    <span className="font-medium">
                      {t("profileForm.fields.selfTraits.label")}:
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.self_traits.map((traitId) => (
                        <span
                          key={traitId}
                          className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                        >
                          {getTraitName(traitId)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {formData.ideal_traits && formData.ideal_traits.length > 0 && (
                  <div>
                    <span className="font-medium">
                      {t("profileForm.fields.idealTraits.label")}:
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.ideal_traits.map((traitId) => (
                        <span
                          key={traitId}
                          className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                        >
                          {getTraitName(traitId)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Physical Boundary */}
          {formData.physical_boundary && (
            <div>
              <h3 className="font-semibold text-lg mb-3">
                {t("profileForm.reviewModal.sections.physicalBoundary")}
              </h3>
              <div className="ml-7">
                <span className="font-medium">
                  {t("profileForm.fields.physicalBoundary.label")}
                </span>
                {":  "}
                <span className="font-bold">
                  {t(
                    `profileForm.reviewModal.physicalBoundaryScale.${formData.physical_boundary}`,
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Recent Topics */}
          {formData.recent_topics && (
            <div>
              <h3 className="font-semibold text-lg mb-3">
                {t("profileForm.reviewModal.sections.recentTopics")}
              </h3>
              <div className="ml-7">
                <span className="font-medium">
                  {t("profileForm.fields.recentTopics.label")}:
                </span>
                <div className="mt-1 p-3 bg-gray-50 rounded text-sm">
                  {formData.recent_topics}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormReviewModal;
