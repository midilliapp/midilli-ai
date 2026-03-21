import type { Metadata } from "next";

import {
  LegalCard,
  LegalCardGrid,
  LegalList,
  LegalPageShell,
  LegalSection,
} from "../components/legal-page-shell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Midilli AI, including subscriptions, acceptable use, and content rules.",
};

export default function TermsPage() {
  return (
    <LegalPageShell
      eyebrow="Terms"
      title="Terms of Service"
      description="These Terms of Service govern access to and use of Midilli AI, including accounts, subscriptions, generated content, community features, and payment-related usage."
      lastUpdated="March 21, 2026"
    >
      <LegalSection title="Overview">
        <p>
          By accessing or using Midilli AI, you agree to be bound by these
          Terms. If you do not agree, you must not use the service.
        </p>
        <LegalCardGrid>
          <LegalCard title="Applies to">
            All visitors, registered users, subscribers, and anyone using
            Midilli AI features or checkout flows.
          </LegalCard>
          <LegalCard title="Covers">
            Accounts, subscriptions, credits, generated output, community
            features, acceptable use, and service availability.
          </LegalCard>
          <LegalCard title="Related pages">
            Pricing, Privacy Policy, and Refund Policy should be read together
            with these Terms.
          </LegalCard>
        </LegalCardGrid>
      </LegalSection>

      <LegalSection title="Service Description">
        <p>
          Midilli AI is a software service that allows users to generate,
          preview, organize, and share AI-assisted visual content, including
          images, motion concepts, and related creative assets.
        </p>
      </LegalSection>

      <LegalSection title="Accounts and Eligibility">
        <LegalList
          items={[
            "You are responsible for the accuracy of the information used to register your account.",
            "You are responsible for maintaining the confidentiality of your login credentials.",
            "You must not share your account in a way that bypasses plan limits or intended usage controls.",
            "We may suspend or restrict accounts used fraudulently, abusively, or in violation of these Terms.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Pricing, Subscriptions, and Credits">
        <LegalList
          items={[
            "Paid plans and credit packs are described at midilli.app/price.",
            "Subscriptions may renew automatically unless canceled before the next billing date.",
            "Credits and plan features may differ by tier, promotion, launch phase, or product updates.",
            "Failure to complete payment may result in suspension, downgrade, or loss of access to paid features.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Refunds and Cancellations">
        <p>
          Refund handling is described at midilli.app/refund. Cancellation stops
          future renewals but does not automatically create a refund for charges
          already processed, except where required by law or approved under our
          refund policy.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable Use">
        <LegalList
          items={[
            "You must not use Midilli AI to create unlawful, deceptive, infringing, hateful, violent, or sexually exploitative material.",
            "You must not attempt to reverse engineer, scrape, overload, or disrupt the service or connected providers.",
            "You must not use the service to violate privacy, impersonate another person, or distribute malware or spam.",
            "We may remove shared content or suspend access where we reasonably believe content or behavior creates legal, safety, or platform risk.",
          ]}
        />
      </LegalSection>

      <LegalSection title="User Content and Generated Output">
        <LegalList
          items={[
            "You retain rights in prompts and source material you submit, subject to the rights needed for us and our subprocessors to operate the service.",
            "Subject to your compliance with these Terms and any applicable third-party model restrictions, Midilli AI grants you rights to use generated output produced for your account.",
            "Commercial rights apply only where your selected plan expressly includes them.",
            "You are responsible for reviewing generated content before publishing, selling, or relying on it.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Third-Party Services">
        <p>
          Midilli AI may rely on third-party infrastructure and software
          providers for authentication, storage, model inference, analytics, and
          billing. Those providers may apply their own terms and technical
          limitations where relevant to the delivery of the service.
        </p>
      </LegalSection>

      <LegalSection title="Availability and Changes">
        <LegalList
          items={[
            "We may update features, models, limits, pricing, or product workflows at any time.",
            "We do not guarantee uninterrupted availability, error-free operation, or permanent availability of any specific AI model.",
            "We may modify or discontinue beta, preview, or experimental features without liability.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Disclaimers and Liability">
        <LegalList
          items={[
            "The service is provided on an as available and as is basis to the fullest extent permitted by law.",
            "AI-generated output may contain inaccuracies, unexpected artifacts, or legal risk depending on use case and jurisdiction.",
            "To the fullest extent permitted by law, Midilli AI is not liable for indirect, incidental, consequential, or special damages arising from use of the service.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Termination">
        <p>
          We may suspend or terminate access where necessary to protect the
          service, other users, our providers, or legal compliance. You may stop
          using the service at any time and may cancel paid renewals through the
          available billing controls.
        </p>
      </LegalSection>

      <LegalSection title="Policy Relationship">
        <LegalList
          items={[
            "Pricing details are published at midilli.app/price.",
            "Privacy handling is described at midilli.app/privacy.",
            "Refund handling is described at midilli.app/refund.",
            "If these Terms conflict with mandatory consumer law, the applicable law controls to that extent.",
          ]}
        />
      </LegalSection>
    </LegalPageShell>
  );
}
