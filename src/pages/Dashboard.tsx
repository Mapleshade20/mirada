import {
  EyeOutlined,
  FormOutlined,
  HeartOutlined,
  HomeOutlined,
  IdcardOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Modal,
  message,
  Select,
  Steps,
  Upload,
} from "antd";
import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import FinalMatchCard from "../components/FinalMatchCard";
import Footer from "../components/Footer";
import LanguageSwitcher from "../components/LanguageSwitcher";
import NovatrixBackground from "../components/ui/uvcanvas-background";
import { useImageCompression } from "../hooks/useImageCompression";
import { apiService } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { getAllowedGrades, translateGrade } from "../utils/validation";

const { Option } = Select;

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout, updateUserProfile, fetchUserProfile } = useAuthStore();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [nextMatchTime, setNextMatchTime] = useState<string | null>(null);
  const [form] = Form.useForm();
  const { compressImage, state: compressionState } = useImageCompression();

  useEffect(() => {
    // Check if this is the first time visiting dashboard
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (hasSeenOnboarding !== "true") {
      setShowOnboarding(true);
    }
  }, []);

  useEffect(() => {
    // Safety fallback: refresh user profile if data seems stale
    // This prevents issues when user is redirected here after status changes
    if (user && !user.status) {
      fetchUserProfile();
    }
  }, [user, fetchUserProfile]);

  useEffect(() => {
    // Fetch next match time on component mount
    const fetchNextMatchTime = async () => {
      try {
        const response = await apiService.getNextMatchTime();
        setNextMatchTime(response.next);
      } catch (error) {
        console.error("Failed to fetch next match time:", error);
      }
    };

    fetchNextMatchTime();
  }, []);

  const getCurrentStep = () => {
    if (!user) return 0;

    switch (user.status) {
      case "unverified":
        return 0;
      case "verification_pending":
        return 0;
      case "verified":
        return 1;
      case "form_completed":
        return 2;
      case "matched":
        return 3;
      case "confirmed":
        return 4;
      default:
        return 0;
    }
  };

  const getStepStatus = (stepIndex: number) => {
    const currentStep = getCurrentStep();
    if (stepIndex < currentStep) return "finish";
    if (stepIndex === currentStep) return "process";
    return "wait";
  };

  const handleOnboardingNext = () => {
    if (onboardingStep < 2) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setShowOnboarding(false);
      localStorage.setItem("hasSeenOnboarding", "true");
    }
  };

  const handleOnboardingBack = () => {
    if (onboardingStep > 0) {
      setOnboardingStep(onboardingStep - 1);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formatMatchTime = (timeString: string | null) => {
    if (!timeString) return null;

    try {
      const date = new Date(timeString);
      return date.toLocaleString("zh-CN");
    } catch (error) {
      console.error("Failed to format match time:", error);
      return null;
    }
  };

  const handleUploadIdCard = async (values: {
    upload?: Array<{ originFileObj?: File; name?: string }>;
    grade?: string;
  }) => {
    try {
      const file = values.upload?.[0]?.originFileObj || values.upload?.[0];
      if (!file) {
        message.error(t("uploadModal.selectFileError"));
        return;
      }

      // Compress the image before uploading
      const compressedFile = await compressImage(file, {
        targetSizeBytes: 1024 * 1024, // 1MB
        maxDimension: 2160,
      });

      const updatedProfile = await apiService.uploadIdCard(
        compressedFile,
        values.grade,
      );
      updateUserProfile(updatedProfile);
      setUploadModalVisible(false);
      form.resetFields();
      message.success(t("uploadModal.uploadSuccess"));
    } catch (error) {
      console.error("ID card upload failed:", error);
      message.error(
        error instanceof Error ? error.message : t("uploadModal.uploadError"),
      );
    }
  };

  const steps = [
    {
      title: t("steps.idVerification.title"),
      icon: <IdcardOutlined />,
      description: t("steps.idVerification.description"),
    },
    {
      title: t("steps.profileForm.title"),
      icon: <FormOutlined />,
      description: t("steps.profileForm.description"),
    },
    {
      title: t("steps.previewMatches.title"),
      icon: <EyeOutlined />,
      description: t("steps.previewMatches.description"),
    },
    {
      title: t("steps.finalMatch.title"),
      icon: <HeartOutlined />,
      description: t("steps.finalMatch.description"),
    },
  ];

  const renderStepContent = () => {
    if (!user) return null;

    switch (user.status) {
      case "unverified":
        return (
          <Card className="mt-6">
            <div className="text-center">
              <IdcardOutlined className="text-4xl text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t("steps.idVerification.uploadTitle")}
              </h3>
              <p className="text-gray-600 mb-4">
                {t("steps.idVerification.uploadDescription")}
              </p>
              <Button
                type="primary"
                size="large"
                onClick={() => setUploadModalVisible(true)}
              >
                {t("steps.idVerification.uploadButton")}
              </Button>
            </div>
          </Card>
        );

      case "verification_pending":
        return (
          <Card className="mt-6">
            <div className="text-center">
              <IdcardOutlined className="text-4xl text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t("steps.verificationPending.title")}
              </h3>
              <p className="text-gray-600">
                {t("steps.verificationPending.description")}
              </p>
            </div>
          </Card>
        );

      case "verified":
        return (
          <Card className="mt-6">
            <div className="text-center">
              <FormOutlined className="text-4xl text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t("steps.profileForm.completeTitle")}
              </h3>
              <p className="text-gray-600 mb-4">
                {t("steps.profileForm.completeDescription")}
              </p>
              <Button
                type="primary"
                size="large"
                onClick={() => navigate("/form")}
              >
                {t("steps.profileForm.completeButton")}
              </Button>
            </div>
          </Card>
        );

      case "form_completed":
        return (
          <Card className="mt-6">
            <div className="text-center">
              <EyeOutlined className="text-4xl text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t("steps.previewMatches.reviewTitle")}
              </h3>
              <p className="text-gray-600 mb-4">
                {t("steps.previewMatches.description")}
              </p>
              <Button
                type="primary"
                size="large"
                onClick={() => navigate("/previews")}
              >
                {t("steps.previewMatches.viewButton")}
              </Button>
            </div>
          </Card>
        );

      case "matched":
        return user.final_match ? (
          <div className="mt-6">
            <FinalMatchCard finalMatch={user.final_match} />
          </div>
        ) : (
          <Card className="mt-6">
            <div className="text-center">
              <HeartOutlined className="text-4xl text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">You Have a Match!</h3>
              <p className="text-gray-600">Loading your match details...</p>
            </div>
          </Card>
        );

      case "confirmed": {
        // Check if both users have confirmed (wechat_id is available)
        const bothConfirmed = user.final_match?.wechat_id != null;

        return (
          <div className="mt-6 space-y-6">
            {/* Confirmation status card */}
            <Card>
              <div className="text-center">
                <HeartOutlined
                  className={`text-4xl mb-4 ${bothConfirmed ? "text-green-500" : "text-orange-500"}`}
                />
                <h3 className="text-xl font-semibold mb-2">
                  {bothConfirmed
                    ? t("steps.confirmed.mutualTitle")
                    : t("steps.confirmed.waitingTitle")}
                </h3>
                <p className="text-gray-600 mb-4">
                  {bothConfirmed
                    ? t("steps.confirmed.mutualDescription")
                    : t("steps.confirmed.waitingDescription")}
                </p>
                {bothConfirmed && user.final_match?.wechat_id && (
                  <div className="bg-green-50 p-4 rounded-lg mb-4">
                    <strong>{user.final_match.wechat_id}</strong>
                  </div>
                )}
                <p className="text-gray-600">
                  {bothConfirmed
                    ? t("steps.confirmed.mutualFooter")
                    : t("steps.confirmed.waitingFooter")}
                </p>
              </div>
            </Card>

            {/* Show partner profile if available */}
            {user.final_match && (
              <FinalMatchCard
                finalMatch={user.final_match}
                showActions={false}
                showTitle={false}
              />
            )}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Background */}
      <NovatrixBackground opacity={0.6} />

      <div className="relative z-10 flex-1">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                  {t("dashboard.title")}
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  {t("dashboard.welcome", { email: user?.email })}
                </p>
              </div>

              {nextMatchTime && (
                <div className="order-3 sm:order-2 px-3 py-1 bg-blue-50 rounded-lg border border-blue-200 self-start sm:self-center">
                  <p className="text-xs sm:text-sm text-blue-400">
                    <strong>{t("dashboard.nextMatch")}</strong>{" "}
                    {formatMatchTime(nextMatchTime)}
                  </p>
                </div>
              )}

              <div className="order-2 sm:order-3 flex items-center gap-2 flex-wrap">
                <Button
                  icon={<HomeOutlined />}
                  onClick={() => navigate("/")}
                  type="text"
                  size="small"
                  className="flex items-center"
                >
                  <span className="hidden sm:inline ml-1">
                    {t("common.home")}
                  </span>
                </Button>
                <LanguageSwitcher />
                <Button
                  icon={<InfoCircleOutlined />}
                  onClick={() => {
                    setOnboardingStep(0);
                    setShowOnboarding(true);
                  }}
                  type="text"
                  size="small"
                  className="flex items-center"
                >
                  <span className="hidden sm:inline ml-1">
                    {t("dashboard.privacyHints")}
                  </span>
                </Button>
                <Button
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  type="text"
                  size="small"
                  danger
                  className="flex items-center"
                >
                  <span className="hidden sm:inline ml-1">
                    {t("dashboard.logout")}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto p-6">
          {/* Progress Steps */}
          <Card className="mb-6">
            <Steps
              current={getCurrentStep()}
              items={steps.map((step, index) => ({
                ...step,
                status: getStepStatus(index),
              }))}
            />
          </Card>

          {/* Step Content */}
          {renderStepContent()}
        </div>
      </div>

      <Footer />

      {/* Onboarding Modal */}
      <Modal
        title={t("dashboard.onboarding.title")}
        open={showOnboarding}
        onCancel={() => setShowOnboarding(false)}
        centered
        footer={[
          <Button
            key="back"
            onClick={handleOnboardingBack}
            disabled={onboardingStep === 0}
          >
            {t("dashboard.onboarding.before")}
          </Button>,
          <Button key="next" type="primary" onClick={handleOnboardingNext}>
            {onboardingStep < 2
              ? t("dashboard.onboarding.next")
              : t("dashboard.onboarding.ok")}
          </Button>,
        ]}
      >
        {onboardingStep === 0 && (
          <div className="text-center py-4">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold mb-2">
              {t("dashboard.onboarding.dataProtection.title")}
            </h3>
            <p>{t("dashboard.onboarding.dataProtection.description")}</p>
          </div>
        )}
        {onboardingStep === 1 && (
          <div className="text-center py-4">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold mb-2">
              {t("dashboard.onboarding.systemPrivacy.title")}
            </h3>
            <p>{t("dashboard.onboarding.systemPrivacy.description")}</p>
          </div>
        )}
        {onboardingStep === 2 && (
          <div className="text-center py-4">
            <div className="text-6xl mb-4">💝</div>
            <h3 className="text-lg font-semibold mb-2">
              {t("dashboard.onboarding.qualityConnections.title")}
            </h3>
            <p>{t("dashboard.onboarding.qualityConnections.description")}</p>
          </div>
        )}
      </Modal>

      {/* Upload ID Card Modal */}
      <Modal
        title={t("uploadModal.title")}
        open={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleUploadIdCard} layout="vertical">
          <Form.Item
            name="grade"
            label={t("uploadModal.gradeLabel")}
            rules={[
              { required: true, message: t("uploadModal.gradeRequired") },
            ]}
          >
            <Select placeholder={t("uploadModal.gradePlaceholder")}>
              {getAllowedGrades().map((grade) => (
                <Option key={grade} value={grade}>
                  {translateGrade(grade, t)}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="upload"
            label={t("uploadModal.idCardLabel")}
            rules={[
              { required: true, message: t("uploadModal.idCardRequired") },
            ]}
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
          >
            <Upload
              maxCount={1}
              beforeUpload={() => false}
              accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
              disabled={compressionState.isCompressing}
            >
              <Button
                icon={<UploadOutlined />}
                disabled={compressionState.isCompressing}
              >
                {t("uploadModal.selectImage")}
              </Button>
            </Upload>

            {/* Compression Progress */}
            {compressionState.isCompressing && (
              <div className="mt-4 text-center">
                <div className="text-sm text-blue-600 mb-2">
                  Processing image... ({compressionState.progress}%)
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  {compressionState.currentStep}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${compressionState.progress}%` }}
                  />
                </div>
              </div>
            )}
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setUploadModalVisible(false)}>
                {t("uploadModal.cancel")}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                disabled={compressionState.isCompressing}
                loading={compressionState.isCompressing}
              >
                {compressionState.isCompressing
                  ? "Processing..."
                  : t("uploadModal.upload")}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard;
