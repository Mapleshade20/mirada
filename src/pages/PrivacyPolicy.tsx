import { ArrowLeft } from "lucide-react";
import type React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PrivacyPolicy: React.FC = () => {
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
          <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">
            <strong>Last Updated: Sept 19, 2025 (GMT+8)</strong>
          </p>

          <p className="mb-6">
            This Privacy Policy describes how your personal information is
            collected, used, and shared when you participate in the Contigo
            event.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            1. What Information We Collect
          </h2>
          <p className="mb-4">We collect the following types of information:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>
              <strong>Identity Information:</strong> Your email address, which
              you provide during registration for verification purposes.
            </li>
            <li>
              <strong>Profile Information:</strong> All the answers you provide
              in the questionnaire, which may include your contact method,
              grade, major, interests, social preferences, and a
              self-description.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            2. How We Use Your Information
          </h2>
          <p className="mb-4">
            Your information is used for the sole purpose of operating the
            matching event:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>
              <strong>Email Address:</strong> Used exclusively to send you a
              verification code and to notify you of your match result. We will
              not send you any marketing or promotional emails.
            </li>
            <li>
              <strong>Profile Information:</strong> Used as input for our
              matching algorithm to find a suitable match for you. Anonymized
              versions of your profile may be shown to a potential match before
              you are both asked for final confirmation.
            </li>
            <li>
              <strong>Contact Information:</strong> Your contact method will be
              shown to your partner after both parties have agreed the match.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            3. Data Sharing and Disclosure
          </h2>
          <p className="mb-4">We are committed to protecting your privacy.</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>
              <strong>With Your Match:</strong> We will only share your contact
              information and identity with your final, confirmed match, and
              only after you and your match have both explicitly consented to
              the pairing.
            </li>
            <li>
              <strong>With Third Parties:</strong> We do not sell, trade, or
              rent your personal information to others. We use Mailgun as a
              third-party service provider to send transactional emails. Their
              privacy policy can be found on their website.
            </li>
            <li>
              <strong>We will never make your data public.</strong>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            4. Data Retention
          </h2>
          <p className="mb-6">
            This is a temporary event. All personally identifiable information
            you provide, including your email, profile answers, and any
            resulting matches, will be{" "}
            <strong>securely and permanently deleted within 30 days</strong>{" "}
            after the conclusion of the event.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Security</h2>
          <p className="mb-6">
            We take reasonable technical measures to protect the information we
            collect from loss, misuse, and unauthorized access.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact Us</h2>
          <p className="mb-6">
            For more information about our privacy practices or if you have
            questions, please contact us by email at{" "}
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

export default PrivacyPolicy;
