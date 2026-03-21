import type { Metadata } from "next";

import {
  LegalCard,
  LegalCardGrid,
  LegalList,
  LegalPageShell,
  LegalSection,
} from "../components/legal-page-shell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Midilli AI, including data collection, billing data, prompts, and account data.",
};

export default function PrivacyPage() {
  return (
    <LegalPageShell
      eyebrow="Privacy"
      title="Privacy Policy"
      description="This Privacy Policy explains what information Midilli AI collects, how it is used, when it may be shared with service providers, and the choices users have regarding personal data."
      lastUpdated="March 21, 2026"
    >
      <LegalSection title="Information We Collect">
        <LegalCardGrid>
          <LegalCard title="Account data">
            Email, authentication identifiers, and basic profile details needed
            to access Midilli AI.
          </LegalCard>
          <LegalCard title="Usage data">
            Prompts, generations, selected models, product events, and feature
            interactions.
          </LegalCard>
          <LegalCard title="Billing data">
            Transaction details needed for subscriptions, taxes, receipts, and
            fraud prevention.
          </LegalCard>
        </LegalCardGrid>
        <LegalList
          items={[
            "Account data, such as email address, authentication identifiers, and account profile information.",
            "Usage data, such as prompts, generation requests, selected models, session activity, and feature interactions.",
            "Community and sharing data, such as usernames, gallery posts, comments, and likes when users choose to publish content.",
            "Transaction and billing data necessary to process purchases, subscriptions, taxes, fraud checks, and receipts.",
          ]}
        />
      </LegalSection>

      <LegalSection title="How We Use Information">
        <LegalList
          items={[
            "To provide account access, generation features, storage, and customer support.",
            "To process subscriptions, one-time credit purchases, billing events, and payment-related compliance.",
            "To maintain service security, prevent abuse, debug failures, and improve product performance.",
            "To operate community features such as gallery posts, likes, and comments when users choose to participate.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Payments and Billing Providers">
        <p>
          Payment transactions may be processed by third-party billing and
          payment partners, including Paddle. Midilli AI does not need to store
          full payment card numbers in order to provide the service. Billing
          partners may collect and process payment, tax, fraud-prevention, and
          invoicing data under their own privacy terms.
        </p>
      </LegalSection>

      <LegalSection title="Service Providers and Infrastructure">
        <p>
          Midilli AI may use third-party providers for account authentication,
          hosting, database services, AI model inference, file delivery, and
          payment processing. We share only the information reasonably necessary
          for those providers to perform services on our behalf.
        </p>
      </LegalSection>

      <LegalSection title="Prompts, Uploads, and Generated Content">
        <LegalList
          items={[
            "Prompts and uploaded inputs may be processed by AI infrastructure providers in order to generate requested outputs.",
            "Generated content may be stored in user sessions, account history, or community features depending on product settings and user actions.",
            "Users should avoid uploading sensitive personal information unless necessary for their intended use case.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Cookies and Similar Technologies">
        <p>
          Midilli AI may use cookies, local storage, and similar technologies to
          support authentication, preserve session state, remember preferences,
          improve product performance, and protect the service against abuse.
        </p>
      </LegalSection>

      <LegalSection title="Data Retention">
        <p>
          We retain data for as long as reasonably necessary to operate the
          service, comply with legal obligations, resolve disputes, enforce
          agreements, and maintain business records. Retention periods may vary
          by data type and operational need.
        </p>
      </LegalSection>

      <LegalSection title="User Rights and Choices">
        <LegalList
          items={[
            "Users may update certain account information through available product controls.",
            "Users may cancel paid subscriptions to stop future renewals.",
            "Where required by applicable law, users may request access, correction, deletion, or portability of their personal data.",
          ]}
        />
      </LegalSection>

      <LegalSection title="International Processing">
        <p>
          Service providers and infrastructure used by Midilli AI may operate in
          multiple countries. By using the service, users understand that
          information may be processed in jurisdictions other than their own,
          subject to appropriate contractual, legal, or operational safeguards
          where required.
        </p>
      </LegalSection>

      <LegalSection title="Policy Updates">
        <p>
          We may update this Privacy Policy from time to time. Material changes
          will be reflected on this page with a revised effective date.
        </p>
      </LegalSection>

      <LegalSection title="Summary">
        <LegalList
          items={[
            "We collect only the information needed to operate, secure, improve, and bill for the service.",
            "Payments may be processed by approved third-party billing providers.",
            "Prompts and uploads may be processed by AI infrastructure providers to generate outputs.",
            "Users may request account and privacy-related help where required by applicable law.",
          ]}
        />
      </LegalSection>
    </LegalPageShell>
  );
}
