import React, { useEffect, useState, useCallback } from 'react';
import { Steps, Button, Card, Modal, Upload, Form, Select, Input, message } from 'antd';
import { 
  UserOutlined, 
  IdcardOutlined, 
  FormOutlined, 
  EyeOutlined, 
  HeartOutlined,
  LogoutOutlined,
  InfoCircleOutlined,
  UploadOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { apiService } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { getAllowedGrades } from '../utils/validation';
import LanguageSwitcher from '../components/LanguageSwitcher';
import heroBackground from '../assets/hero-background.jpg';

const { Option } = Select;
const { TextArea } = Input;

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout, updateUserProfile, fetchUserProfile } = useAuthStore();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [form] = Form.useForm();

  const checkAndFetchProfile = useCallback(() => {
    if (!user) {
      fetchUserProfile();
    }
  }, [user, fetchUserProfile]);

  useEffect(() => {
    // Check if this is the first time visiting dashboard
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (hasSeenOnboarding !== 'true') {
      setShowOnboarding(true);
    }
    
    // Only fetch profile if we don't have user data yet
    checkAndFetchProfile();
  }, [checkAndFetchProfile]);

  const getCurrentStep = () => {
    if (!user) return 0;
    
    switch (user.status) {
      case 'unverified':
        return 0;
      case 'verification_pending':
        return 0;
      case 'verified':
        return 1;
      case 'form_completed':
        return 2;
      case 'matched':
        return 3;
      case 'confirmed':
        return 4;
      default:
        return 0;
    }
  };

  const getStepStatus = (stepIndex: number) => {
    const currentStep = getCurrentStep();
    if (stepIndex < currentStep) return 'finish';
    if (stepIndex === currentStep) return 'process';
    return 'wait';
  };

  const handleOnboardingNext = () => {
    if (onboardingStep < 2) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setShowOnboarding(false);
      localStorage.setItem('hasSeenOnboarding', 'true');
    }
  };

  const handleOnboardingBack = () => {
    if (onboardingStep > 0) {
      setOnboardingStep(onboardingStep - 1);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleUploadIdCard = async (values: { upload?: Array<{ originFileObj?: File; name?: string }> }) => {
    try {
      const file = values.upload?.[0]?.originFileObj || values.upload?.[0];
      if (!file) {
        message.error(t('uploadModal.selectFileError'));
        return;
      }

      const updatedProfile = await apiService.uploadIdCard(file, values.grade);
      updateUserProfile(updatedProfile);
      setUploadModalVisible(false);
      form.resetFields();
      message.success(t('uploadModal.uploadSuccess'));
    } catch (error) {
      message.error(t('uploadModal.uploadError'));
    }
  };

  const steps = [
    {
      title: t('steps.idVerification.title'),
      icon: <IdcardOutlined />,
      description: t('steps.idVerification.description'),
    },
    {
      title: t('steps.profileForm.title'),
      icon: <FormOutlined />,
      description: t('steps.profileForm.description'),
    },
    {
      title: t('steps.previewMatches.title'),
      icon: <EyeOutlined />,
      description: t('steps.previewMatches.description'),
    },
    {
      title: t('steps.finalMatch.title'),
      icon: <HeartOutlined />,
      description: t('steps.finalMatch.description'),
    },
  ];

  const renderStepContent = () => {
    if (!user) return null;

    switch (user.status) {
      case 'unverified':
        return (
          <Card className="mt-6">
            <div className="text-center">
              <IdcardOutlined className="text-4xl text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('steps.idVerification.uploadTitle')}</h3>
              <p className="text-gray-600 mb-4">
                {t('steps.idVerification.uploadDescription')}
              </p>
              <Button 
                type="primary" 
                size="large"
                onClick={() => setUploadModalVisible(true)}
              >
                {t('steps.idVerification.uploadButton')}
              </Button>
            </div>
          </Card>
        );

      case 'verification_pending':
        return (
          <Card className="mt-6">
            <div className="text-center">
              <IdcardOutlined className="text-4xl text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('steps.verificationPending.title')}</h3>
              <p className="text-gray-600">
                {t('steps.verificationPending.description')}
              </p>
            </div>
          </Card>
        );

      case 'verified':
        return (
          <Card className="mt-6">
            <div className="text-center">
              <FormOutlined className="text-4xl text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('steps.profileForm.completeTitle')}</h3>
              <p className="text-gray-600 mb-4">
                {t('steps.profileForm.completeDescription')}
              </p>
              <Button 
                type="primary" 
                size="large"
                onClick={() => navigate('/form')}
              >
                {t('steps.profileForm.completeButton')}
              </Button>
            </div>
          </Card>
        );

      case 'form_completed':
        return (
          <Card className="mt-6">
            <div className="text-center">
              <EyeOutlined className="text-4xl text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Review Match Previews</h3>
              <p className="text-gray-600 mb-4">
                Check out potential matches and use the veto system
              </p>
              <Button 
                type="primary" 
                size="large"
                onClick={() => navigate('/previews')}
              >
                View Previews
              </Button>
            </div>
          </Card>
        );

      case 'matched':
        return (
          <Card className="mt-6">
            <div className="text-center">
              <HeartOutlined className="text-4xl text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">You Have a Match!</h3>
              <p className="text-gray-600 mb-4">
                We found your perfect match. Review their profile and decide.
              </p>
              <Button 
                type="primary" 
                size="large"
                onClick={() => navigate('/match')}
              >
                View Match
              </Button>
            </div>
          </Card>
        );

      case 'confirmed':
        return (
          <Card className="mt-6">
            <div className="text-center">
              <HeartOutlined className="text-4xl text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Match Confirmed!</h3>
              <p className="text-gray-600 mb-4">
                Both of you accepted the match. Here's their WeChat ID:
              </p>
              {user.final_match?.wechat_id && (
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <strong>WeChat ID: {user.final_match.wechat_id}</strong>
                </div>
              )}
              <p className="text-sm text-gray-500">
                Start your conversation and enjoy getting to know each other!
              </p>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBackground}
          alt="Background"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/95 to-background/98" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{t('dashboard.title')}</h1>
              <p className="text-gray-600">{t('dashboard.welcome', { email: user?.email })}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                icon={<HomeOutlined />}
                onClick={() => navigate("/")}
                type="text"
              >
                Home
              </Button>
              <LanguageSwitcher />
              <Button 
                icon={<InfoCircleOutlined />}
                onClick={() => {
                  setOnboardingStep(0);
                  setShowOnboarding(true);
                }}
                type="text"
              >
                {t('dashboard.privacyHints')}
              </Button>
              <Button 
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                type="text"
                danger
              >
                {t('dashboard.logout')}
              </Button>
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

      {/* Onboarding Modal */}
      <Modal
        title={t('dashboard.onboarding.title')}
        open={showOnboarding}
        onCancel={() => setShowOnboarding(false)}
        centered
        footer={[
          <Button 
            key="back" 
            onClick={handleOnboardingBack} 
            disabled={onboardingStep === 0}
          >
            {t('dashboard.onboarding.before')}
          </Button>,
          <Button 
            key="next" 
            type="primary" 
            onClick={handleOnboardingNext}
          >
            {onboardingStep < 2 ? t('dashboard.onboarding.next') : t('dashboard.onboarding.ok')}
          </Button>
        ]}
      >
        {onboardingStep === 0 && (
          <div className="text-center py-4">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold mb-2">{t('dashboard.onboarding.dataProtection.title')}</h3>
            <p>{t('dashboard.onboarding.dataProtection.description')}</p>
          </div>
        )}
        {onboardingStep === 1 && (
          <div className="text-center py-4">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold mb-2">{t('dashboard.onboarding.aiMatching.title')}</h3>
            <p>{t('dashboard.onboarding.aiMatching.description')}</p>
          </div>
        )}
        {onboardingStep === 2 && (
          <div className="text-center py-4">
            <div className="text-6xl mb-4">💝</div>
            <h3 className="text-lg font-semibold mb-2">{t('dashboard.onboarding.qualityConnections.title')}</h3>
            <p>{t('dashboard.onboarding.qualityConnections.description')}</p>
          </div>
        )}
      </Modal>

      {/* Upload ID Card Modal */}
      <Modal
        title={t('uploadModal.title')}
        open={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleUploadIdCard}
          layout="vertical"
        >
          <Form.Item
            name="grade"
            label={t('uploadModal.gradeLabel')}
            rules={[{ required: true, message: t('uploadModal.gradeRequired') }]}
          >
            <Select placeholder={t('uploadModal.gradePlaceholder')}>
              {getAllowedGrades().map(grade => (
                <Option key={grade} value={grade}>
                  {grade.charAt(0).toUpperCase() + grade.slice(1)}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="upload"
            label={t('uploadModal.idCardLabel')}
            rules={[{ required: true, message: t('uploadModal.idCardRequired') }]}
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
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>{t('uploadModal.selectImage')}</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setUploadModalVisible(false)}>
                {t('uploadModal.cancel')}
              </Button>
              <Button type="primary" htmlType="submit">
                {t('uploadModal.upload')}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard;