import {
  EyeOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Alert, Button, Card, Empty, message, Spin } from "antd";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import LanguageSwitcher from "../components/LanguageSwitcher";
import MatchCard from "../components/MatchCard";
import NovatrixBackground from "../components/ui/uvcanvas-background";
import { apiService, type VetoPreview } from "../lib/api";

const MatchPreviews: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [previews, setPreviews] = useState<VetoPreview[]>([]);
  const [vetoes, setVetoes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [previewsData, vetoesData] = await Promise.all([
        apiService.getVetoPreviews(),
        apiService.getVetoes(),
      ]);

      setPreviews(previewsData);
      setVetoes(vetoesData);
    } catch (err) {
      console.error("Failed to fetch preview data:", err);
      setError(t("previews.fetchError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleVeto = async (candidateId: string) => {
    try {
      setActionLoading(candidateId);
      await apiService.submitVeto(candidateId);
      setVetoes([...vetoes, candidateId]);
      message.success(t("previews.vetoSuccess"));
    } catch (err) {
      console.error("Failed to veto candidate:", err);
      message.error(t("previews.vetoError"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevokeVeto = async (candidateId: string) => {
    try {
      setActionLoading(candidateId);
      await apiService.revokeVeto(candidateId);
      setVetoes(vetoes.filter((id) => id !== candidateId));
      message.success(t("previews.revokeSuccess"));
    } catch (err) {
      console.error("Failed to revoke veto:", err);
      message.error(t("previews.revokeError"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  const vetoedCandidates = previews.filter((candidate) =>
    vetoes.includes(candidate.candidate_id),
  );
  const nonVetoedCandidates = previews.filter(
    (candidate) => !vetoes.includes(candidate.candidate_id),
  );

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Background */}
      <NovatrixBackground opacity={0.3} />

      <div className="relative z-10 flex-1">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <EyeOutlined className="text-purple-500" />
                  {t("previews.title")}
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  {t("previews.subtitle")}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  icon={<HomeOutlined />}
                  onClick={() => navigate("/dashboard")}
                  type="text"
                  size="small"
                  className="flex items-center"
                >
                  <span className="hidden sm:inline ml-1">
                    {t("common.dashboard")}
                  </span>
                </Button>
                <LanguageSwitcher />
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleRefresh}
                  loading={loading}
                  type="text"
                  size="small"
                  className="flex items-center"
                >
                  <span className="hidden sm:inline ml-1">
                    {t("previews.refresh")}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto p-6">
          {/* Info Alert */}
          <Alert
            message={t("previews.infoTitle")}
            description={t("previews.infoDescription", {
              interval:
                import.meta.env.VITE_MATCH_PREVIEW_INTERVAL_MINUTES || 10,
            })}
            type="info"
            icon={<InfoCircleOutlined />}
            showIcon
            className="mb-6"
          />

          {loading ? (
            <div className="text-center py-12">
              <Spin size="large" />
              <p className="mt-4 text-gray-600">{t("previews.loading")}</p>
            </div>
          ) : error ? (
            <Card className="text-center py-12">
              <Alert
                message={t("previews.errorTitle")}
                description={error}
                type="error"
                showIcon
                action={
                  <Button size="small" danger onClick={handleRefresh}>
                    {t("common.retry")}
                  </Button>
                }
              />
            </Card>
          ) : previews.length === 0 ? (
            <Card className="text-center py-12">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={t("previews.noMatches")}
              >
                <Button type="primary" onClick={handleRefresh}>
                  {t("previews.checkAgain")}
                </Button>
              </Empty>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Active Candidates */}
              {nonVetoedCandidates.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    {t("previews.potentialMatches")} (
                    {nonVetoedCandidates.length})
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {nonVetoedCandidates.map((candidate) => (
                      <MatchCard
                        key={candidate.candidate_id}
                        candidate={candidate}
                        isVetoed={false}
                        onVeto={handleVeto}
                        onRevokeVeto={handleRevokeVeto}
                        loading={actionLoading === candidate.candidate_id}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Vetoed Candidates */}
              {vetoedCandidates.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 text-red-600">
                    {t("previews.vetoedMatches")} ({vetoedCandidates.length})
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {vetoedCandidates.map((candidate) => (
                      <MatchCard
                        key={candidate.candidate_id}
                        candidate={candidate}
                        isVetoed={true}
                        onVeto={handleVeto}
                        onRevokeVeto={handleRevokeVeto}
                        loading={actionLoading === candidate.candidate_id}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <Card className="bg-blue-50 border-blue-200">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    {t("previews.stats.title")}
                  </h3>
                  <div className="flex justify-center gap-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {nonVetoedCandidates.length}
                      </div>
                      <div className="text-sm text-gray-600">
                        {t("previews.stats.potential")}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {vetoedCandidates.length}
                      </div>
                      <div className="text-sm text-gray-600">
                        {t("previews.stats.vetoed")}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MatchPreviews;
