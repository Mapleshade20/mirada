import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Select,
  Slider,
  TreeSelect,
  Upload,
} from "antd";
import axios from "axios";
import { ArrowLeft, Camera, Heart, MessageCircle, User } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import heroBackground from "../assets/hero-background.jpg";
import Footer from "../components/Footer";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { tagData } from "../data/tags";
import { traitData } from "../data/traits";
import { useDraftSaving } from "../hooks/useDraftSaving";
import { apiService } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { getTagsLimit, getTraitsLimit } from "../utils/validation";

interface FormData {
  wechat_id: string;
  gender: "male" | "female";
  self_intro: string;
  familiar_tags: string[];
  aspirational_tags: string[];
  self_traits: string[];
  ideal_traits: string[];
  physical_boundary: number;
  recent_topics: string;
  profile_photo_filename?: string;
}

const { Option } = Select;
const { TextArea } = Input;

interface Tag {
  id: string;
  name: string;
  is_matchable: boolean;
  children?: Tag[];
}

// Helper function to convert tag data to TreeSelect format
const convertTagsToTreeData = (tags: Tag[], excludedTags: string[] = []) => {
  return tags.map((category) => {
    const children = category.children
      ? convertTagsToTreeData(category.children, excludedTags)
      : undefined;

    // Check if all children are disabled when this node has children
    const allChildrenDisabled =
      children && children.length > 0
        ? children.every((child) => child.disabled)
        : false;

    return {
      title: category.name,
      value: category.id,
      key: category.id,
      // Disable if:
      // 1. Not matchable and has no children (leaf node that can't be selected)
      // 2. Already selected in the other category
      // 3. Has children but all children are disabled
      disabled:
        (!category.is_matchable && !category.children) ||
        excludedTags.includes(category.id) ||
        allChildrenDisabled,
      children,
    };
  });
};

// Helper function to get tag name by ID
const getTagNameById = (tagId: string): string => {
  const findTag = (tags: Tag[]): string | null => {
    for (const tag of tags) {
      if (tag.id === tagId) {
        return tag.name;
      }
      if (tag.children) {
        const found = findTag(tag.children);
        if (found) return found;
      }
    }
    return null;
  };
  return findTag(tagData) || tagId;
};

// Helper function to get trait name by ID
const getTraitNameById = (traitId: string): string => {
  const trait = traitData.find((t) => t.id === traitId);
  return trait ? trait.name : traitId;
};

const ProfileForm: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { updateUserProfile } = useAuthStore();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [familiarTags, setFamiliarTags] = useState<string[]>([]);
  const [aspirationalTags, setAspirationalTags] = useState<string[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState<FormData | null>(null);

  // Use custom hook for draft saving
  const { saveDraft, loadDraft, clearDraft } = useDraftSaving("profile-form");

  // Load existing form data or draft on mount
  useEffect(() => {
    const loadFormData = async () => {
      try {
        // Try to load existing form data from backend
        const existingData = await apiService.getForm();
        form.setFieldsValue(existingData);

        // Initialize tag state
        setFamiliarTags(existingData.familiar_tags || []);
        setAspirationalTags(existingData.aspirational_tags || []);

        // Initialize uploaded photo state
        if (existingData.profile_photo_filename) {
          setUploadedPhoto(existingData.profile_photo_filename);
        }
      } catch (_error) {
        // If no existing data, try to load draft
        const draft = loadDraft();
        if (draft) {
          form.setFieldsValue(draft);

          // Initialize tag state from draft
          setFamiliarTags(draft.familiar_tags || []);
          setAspirationalTags(draft.aspirational_tags || []);

          // Initialize uploaded photo state from draft
          if (draft.profile_photo_filename) {
            setUploadedPhoto(draft.profile_photo_filename);
          }
        }
      }
    };

    loadFormData();
  }, [form, loadDraft]);

  // Convert tag and trait data for Ant Design components
  const familiarTagTreeData = convertTagsToTreeData(tagData, aspirationalTags);
  const aspirationalTagTreeData = convertTagsToTreeData(tagData, familiarTags);

  const traitOptions = traitData.map((trait) => ({
    label: trait.name,
    value: trait.id,
  }));

  const handleUploadPhoto = async (file: File) => {
    try {
      const response = await apiService.uploadProfilePhoto(file);
      setUploadedPhoto(response.filename);
      form.setFieldValue("profile_photo_filename", response.filename);

      // Save draft immediately with the uploaded photo filename
      const currentValues = form.getFieldsValue();
      currentValues.profile_photo_filename = response.filename;
      saveDraft(currentValues);

      message.success(t("profileForm.photoUploadSuccess"));
      return false; // Prevent default upload behavior
    } catch (_error) {
      message.error(t("profileForm.photoUploadError"));
      return false;
    }
  };

  const handleSubmit = async (values: FormData) => {
    // Add uploaded photo filename to form data
    if (uploadedPhoto) {
      values.profile_photo_filename = uploadedPhoto;
    }

    // Store data for review and show modal
    setReviewData(values);
    setShowReviewModal(true);
  };

  const handleFinalSubmit = async () => {
    if (!reviewData) return;

    setIsLoading(true);
    setShowReviewModal(false);

    try {
      await apiService.submitForm(reviewData);

      // Clear draft after successful submission
      clearDraft();

      // Fetch updated user profile to ensure Dashboard shows correct step
      const updatedProfile = await apiService.getProfile();
      updateUserProfile(updatedProfile);

      message.success(t("profileForm.submitSuccess"));
      navigate("/dashboard");
    } catch (error: unknown) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : t("profileForm.submitError");
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Save draft whenever form values change
  const handleValuesChange = (
    _changedValues: Partial<FormData>,
    allValues: FormData,
  ) => {
    saveDraft(allValues);

    // Update tag state for mutual exclusion
    const newFamiliarTags = allValues.familiar_tags || [];
    const newAspirationalTags = allValues.aspirational_tags || [];

    if (newFamiliarTags !== familiarTags) {
      setFamiliarTags(newFamiliarTags);
    }
    if (newAspirationalTags !== aspirationalTags) {
      setAspirationalTags(newAspirationalTags);
    }

    // Validate tag limits
    const totalTags = newFamiliarTags.length + newAspirationalTags.length;

    if (totalTags > getTagsLimit()) {
      message.warning(
        t("profileForm.validation.totalTagsLimit", { limit: getTagsLimit() }),
      );
    }

    // Validate trait limits
    const selfTraits = allValues.self_traits || [];
    const idealTraits = allValues.ideal_traits || [];

    if (selfTraits.length > getTraitsLimit()) {
      message.warning(
        t("profileForm.validation.selfTraitsLimit", {
          limit: getTraitsLimit(),
        }),
      );
    }

    if (idealTraits.length > getTraitsLimit()) {
      message.warning(
        t("profileForm.validation.idealTraitsLimit", {
          limit: getTraitsLimit(),
        }),
      );
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBackground}
          alt="Background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/90 to-background/95" />
      </div>

      <div className="relative z-10 p-4 py-8 flex-1">
        {/* Navigation and Language Switcher */}
        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="pefa-button-outline inline-flex items-center space-x-2 px-4 py-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Dashboard</span>
          </button>
          <LanguageSwitcher />
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">
              {t("profileForm.title")}
            </h1>
            <p className="text-muted-foreground">{t("profileForm.subtitle")}</p>
          </div>

          <Card className="p-8">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              onValuesChange={handleValuesChange}
              initialValues={{
                physical_boundary: 3,
              }}
            >
              {/* Personal Information */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-6">
                  <User className="h-5 w-5 text-blue-500" />
                  <h2 className="text-xl font-semibold">
                    {t("profileForm.sections.personalInfo")}
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Form.Item
                    name="wechat_id"
                    label={t("profileForm.fields.wechatId.label")}
                    rules={[
                      {
                        required: true,
                        message: t("profileForm.fields.wechatId.required"),
                      },
                    ]}
                  >
                    <Input
                      placeholder={t("profileForm.fields.wechatId.placeholder")}
                    />
                  </Form.Item>

                  <Form.Item
                    name="gender"
                    label={t("profileForm.fields.gender.label")}
                    rules={[
                      {
                        required: true,
                        message: t("profileForm.fields.gender.required"),
                      },
                    ]}
                  >
                    <Select
                      placeholder={t("profileForm.fields.gender.placeholder")}
                    >
                      <Option value="male">
                        {t("profileForm.fields.gender.male")}
                      </Option>
                      <Option value="female">
                        {t("profileForm.fields.gender.female")}
                      </Option>
                    </Select>
                  </Form.Item>
                </div>

                <Form.Item
                  name="self_intro"
                  label={t("profileForm.fields.selfIntro.label")}
                  rules={[
                    {
                      required: true,
                      message: t("profileForm.fields.selfIntro.required"),
                    },
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder={t("profileForm.fields.selfIntro.placeholder")}
                  />
                </Form.Item>
              </div>

              {/* Interests */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-6">
                  <Heart className="h-5 w-5 text-pink-500" />
                  <h2 className="text-xl font-semibold">
                    {t("profileForm.sections.interests")}
                  </h2>
                </div>

                <div className="space-y-4">
                  <Form.Item
                    name="familiar_tags"
                    label={t("profileForm.fields.familiarTags.label")}
                    rules={[
                      {
                        required: true,
                        message: t("profileForm.fields.familiarTags.required"),
                      },
                      {
                        validator: (_, value) => {
                          const aspirationalTags =
                            form.getFieldValue("aspirational_tags") || [];
                          const totalTags =
                            (value || []).length + aspirationalTags.length;
                          if (totalTags > getTagsLimit()) {
                            return Promise.reject(
                              new Error(
                                t("profileForm.validation.totalTagsLimit", {
                                  limit: getTagsLimit(),
                                }),
                              ),
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <TreeSelect
                      multiple
                      treeData={familiarTagTreeData}
                      placeholder={t(
                        "profileForm.fields.familiarTags.placeholder",
                      )}
                      treeCheckable
                      showCheckedStrategy={TreeSelect.SHOW_CHILD}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="aspirational_tags"
                    label={t("profileForm.fields.aspirationalTags.label")}
                    rules={[
                      {
                        required: true,
                        message: t(
                          "profileForm.fields.aspirationalTags.required",
                        ),
                      },
                      {
                        validator: (_, value) => {
                          const familiarTags =
                            form.getFieldValue("familiar_tags") || [];
                          const totalTags =
                            (value || []).length + familiarTags.length;
                          if (totalTags > getTagsLimit()) {
                            return Promise.reject(
                              new Error(
                                t("profileForm.validation.totalTagsLimit", {
                                  limit: getTagsLimit(),
                                }),
                              ),
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <TreeSelect
                      multiple
                      treeData={aspirationalTagTreeData}
                      placeholder={t(
                        "profileForm.fields.aspirationalTags.placeholder",
                      )}
                      treeCheckable
                      showCheckedStrategy={TreeSelect.SHOW_CHILD}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </div>
              </div>

              {/* Personality */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-6">
                  <MessageCircle className="h-5 w-5 text-purple-500" />
                  <h2 className="text-xl font-semibold">
                    {t("profileForm.sections.personality")}
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Form.Item
                    name="self_traits"
                    label={t("profileForm.fields.selfTraits.label")}
                    rules={[
                      {
                        required: true,
                        message: t("profileForm.fields.selfTraits.required"),
                      },
                      {
                        validator: (_, value) => {
                          if ((value || []).length > getTraitsLimit()) {
                            return Promise.reject(
                              new Error(
                                t("profileForm.validation.traitsLimit", {
                                  limit: getTraitsLimit(),
                                }),
                              ),
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      options={traitOptions}
                      placeholder={t(
                        "profileForm.fields.selfTraits.placeholder",
                      )}
                    />
                  </Form.Item>

                  <Form.Item
                    name="ideal_traits"
                    label={t("profileForm.fields.idealTraits.label")}
                    rules={[
                      {
                        required: true,
                        message: t("profileForm.fields.idealTraits.required"),
                      },
                      {
                        validator: (_, value) => {
                          if ((value || []).length > getTraitsLimit()) {
                            return Promise.reject(
                              new Error(
                                t("profileForm.validation.traitsLimit", {
                                  limit: getTraitsLimit(),
                                }),
                              ),
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      options={traitOptions}
                      placeholder={t(
                        "profileForm.fields.idealTraits.placeholder",
                      )}
                    />
                  </Form.Item>
                </div>
              </div>

              {/* Physical Boundary */}
              <div className="mb-8">
                <Form.Item
                  name="physical_boundary"
                  label={t("profileForm.fields.physicalBoundary.label")}
                >
                  <Slider
                    min={1}
                    max={4}
                    step={1}
                    marks={{
                      1: t("profileForm.fields.physicalBoundary.conservative"),
                      4: t("profileForm.fields.physicalBoundary.open"),
                    }}
                    className="physical-boundary-slider"
                  />
                </Form.Item>
              </div>

              {/* Recent Topics */}
              <div className="mb-8">
                <Form.Item
                  name="recent_topics"
                  label={t("profileForm.fields.recentTopics.label")}
                  rules={[
                    {
                      required: true,
                      message: t("profileForm.fields.recentTopics.required"),
                    },
                  ]}
                >
                  <TextArea
                    rows={3}
                    placeholder={t(
                      "profileForm.fields.recentTopics.placeholder",
                    )}
                  />
                </Form.Item>
              </div>

              {/* Profile Photo */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Camera className="h-5 w-5 text-green-500" />
                  <span className="font-medium">
                    {t("profileForm.fields.profilePhoto.label")}
                  </span>
                </div>
                <Upload
                  maxCount={1}
                  beforeUpload={handleUploadPhoto}
                  accept="image/*"
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>
                    {uploadedPhoto
                      ? t("profileForm.fields.profilePhoto.change")
                      : t("profileForm.fields.profilePhoto.upload")}
                  </Button>
                </Upload>
                {uploadedPhoto && (
                  <div className="mt-2 text-green-600">
                    {t("profileForm.fields.profilePhoto.success")}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  size="large"
                  className="w-full"
                >
                  {t("profileForm.submitButton")}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>

      <Footer />

      {/* Review Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("profileForm.reviewModal.title")}</DialogTitle>
            <DialogDescription className="text-orange-600 font-medium">
              {t("profileForm.reviewModal.warning")}
            </DialogDescription>
          </DialogHeader>

          {reviewData && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  {t("profileForm.reviewModal.sections.personalInfo")}
                </h3>
                <div className="space-y-2 ml-7">
                  <div>
                    <span className="font-medium">
                      {t("profileForm.fields.wechatId.label")}:
                    </span>{" "}
                    {reviewData.wechat_id}
                  </div>
                  <div>
                    <span className="font-medium">
                      {t("profileForm.fields.gender.label")}:
                    </span>{" "}
                    {t(`profileForm.fields.gender.${reviewData.gender}`)}
                  </div>
                  <div>
                    <span className="font-medium">
                      {t("profileForm.fields.selfIntro.label")}:
                    </span>
                    <div className="mt-1 p-3 bg-gray-50 rounded text-sm">
                      {reviewData.self_intro}
                    </div>
                  </div>
                </div>
              </div>

              {/* Interests */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  {t("profileForm.reviewModal.sections.interests")}
                </h3>
                <div className="space-y-3 ml-7">
                  <div>
                    <span className="font-medium">
                      {t("profileForm.fields.familiarTags.label")}:
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {reviewData.familiar_tags?.map((tagId) => (
                        <span
                          key={tagId}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {getTagNameById(tagId)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">
                      {t("profileForm.fields.aspirationalTags.label")}:
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {reviewData.aspirational_tags?.map((tagId) => (
                        <span
                          key={tagId}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                        >
                          {getTagNameById(tagId)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Personality */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-purple-500" />
                  {t("profileForm.reviewModal.sections.personality")}
                </h3>
                <div className="space-y-3 ml-7">
                  <div>
                    <span className="font-medium">
                      {t("profileForm.fields.selfTraits.label")}:
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {reviewData.self_traits?.map((traitId) => (
                        <span
                          key={traitId}
                          className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                        >
                          {getTraitNameById(traitId)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">
                      {t("profileForm.fields.idealTraits.label")}:
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {reviewData.ideal_traits?.map((traitId) => (
                        <span
                          key={traitId}
                          className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                        >
                          {getTraitNameById(traitId)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Physical Boundary */}
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  {t("profileForm.reviewModal.sections.physicalBoundary")}
                </h3>
                <div className="ml-7">
                  <span className="font-medium">
                    {t("profileForm.fields.physicalBoundary.label")}:
                  </span>{" "}
                  {t(
                    `profileForm.reviewModal.physicalBoundaryScale.${reviewData.physical_boundary}`,
                  )}
                </div>
              </div>

              {/* Recent Topics */}
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  {t("profileForm.reviewModal.sections.recentTopics")}
                </h3>
                <div className="ml-7">
                  <span className="font-medium">
                    {t("profileForm.fields.recentTopics.label")}:
                  </span>
                  <div className="mt-1 p-3 bg-gray-50 rounded text-sm">
                    {reviewData.recent_topics}
                  </div>
                </div>
              </div>

              {/* Profile Photo */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Camera className="h-5 w-5 text-green-500" />
                  {t("profileForm.reviewModal.sections.profilePhoto")}
                </h3>
                <div className="ml-7">
                  {uploadedPhoto ? (
                    <span className="text-green-600">
                      {t("profileForm.reviewModal.photoStatus.uploaded")}
                    </span>
                  ) : (
                    <span className="text-gray-500">
                      {t("profileForm.reviewModal.photoStatus.notUploaded")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-3">
            <Button onClick={() => setShowReviewModal(false)} className="mr-2">
              {t("profileForm.reviewModal.actions.editMore")}
            </Button>
            <Button
              type="primary"
              onClick={handleFinalSubmit}
              loading={isLoading}
            >
              {t("profileForm.reviewModal.actions.submitFinal")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileForm;
