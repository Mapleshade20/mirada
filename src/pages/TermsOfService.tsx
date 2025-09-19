import { ArrowLeft } from "lucide-react";
import type React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TermsOfService: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t("common.back")}
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground">
            Terms of Service
          </h1>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">
            <strong>Last Updated: Sept 19, 2025 (GMT+8)</strong>
          </p>

          <p className="mb-6">
            Welcome to Contigo! This is a temporary, non-commercial project
            created for a university course assignment. By participating in this
            event, you agree to these Terms of Service.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Eligibility</h2>
          <p className="mb-6">
            You must be a current student of Accepted Universities (as shown on
            homepage of website) with a valid and active university email
            address (e.g.{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-sm">
              @mails.tsinghua.edu.cn
            </code>
            ) to use this service. By registering, you confirm that you meet
            this requirement.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            2. Service Description
          </h2>
          <p className="mb-4">
            This is a platform designed to facilitate a social matching event
            for university students. The service allows you to fill out a
            questionnaire and, based on your responses, attempts to match you
            with another participant.
          </p>
          <p className="mb-6">
            This service is provided for entertainment and social purposes only.
            We do not guarantee a match for every participant, nor do we
            guarantee the quality or outcome of any match.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            3. User Responsibilities
          </h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>
              You agree to provide accurate and truthful information in your
              questionnaire.
            </li>
            <li>
              You agree to interact respectfully with any participant you are
              matched with. Harassment, abuse, or any form of inappropriate
              behavior is strictly prohibited and will result in immediate
              removal from the event.
            </li>
            <li>
              You are responsible for your own safety and interactions with your
              match.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Disclaimers</h2>
          <p className="mb-6">
            This service is provided "as is" without any warranties of any kind.
            We do not perform background checks on any participants. We are not
            responsible for the conduct of any user, either online or offline.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Termination</h2>
          <p className="mb-6">
            We reserve the right to terminate your access to the service at our
            sole discretion, without notice, for any conduct that we believe
            violates these Terms of Service. As this is a temporary event, the
            service will be discontinued after the event period concludes.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact</h2>
          <p className="mb-6">
            If you have any questions about these Terms, please contact us at{" "}
            <a
              href="mailto:maple@maplewrt.com"
              className="text-primary hover:underline"
            >
              maple@maplewrt.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
