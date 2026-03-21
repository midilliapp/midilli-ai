import type { Metadata } from "next";

import {
  LegalCard,
  LegalCardGrid,
  LegalList,
  LegalPageShell,
  LegalSection,
} from "../components/legal-page-shell";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Refund Policy for Midilli AI subscriptions and one-time credit purchases.",
};

export default function RefundPage() {
  return (
    <LegalPageShell
      eyebrow="Refunds"
      title="Refund Policy"
      description="Everything you need to know about subscription cancellations, billing issues, and refund eligibility for Midilli AI."
      lastUpdated="March 21, 2026"
    >
      <section
        style={{
          marginTop: 18,
          padding: 24,
          borderRadius: 24,
          background: "rgba(15,15,26,0.84)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ color: "#8f8aa8", fontSize: 13, marginBottom: 10 }}>
          Refunds and billing
        </div>
        <div style={{ color: "#cbc8d8", lineHeight: 1.8, fontSize: 15, maxWidth: 700 }}>
          Midilli AI aims to keep refund handling simple. If a charge was made in
          error or the service did not deliver the purchased access, a refund may
          be reviewed. If substantial usage has already occurred, a refund will
          usually not be available.
        </div>
        <LegalCardGrid>
          <LegalCard title="Recent charges">
            Refund reviews are strongest when the request is made soon after the
            transaction date.
          </LegalCard>
          <LegalCard title="Low usage cases">
            Refunds are more likely where a user has not materially consumed the
            purchased billing period or credits.
          </LegalCard>
          <LegalCard title="Billing errors">
            Duplicate or clearly incorrect charges may be approved after review.
          </LegalCard>
        </LegalCardGrid>
      </section>

      <LegalSection title="Requesting a Refund">
        <p>
          Midilli AI charges are generally non-refundable once a billing period
          has started or credits have been delivered, except where required by
          law or where a request clearly falls within the eligibility cases
          below.
        </p>
      </LegalSection>

      <LegalSection title="Eligibility Requirements">
        <LegalList
          items={[
            "You must have an active paid subscription or a recent eligible billing charge.",
            "Your request should be submitted shortly after the charge date.",
            "Your account must not show substantial consumption of the purchased billing period if the request is based on accidental purchase or billing dissatisfaction.",
            "We may request basic information needed to verify the transaction and investigate billing history.",
          ]}
        />
      </LegalSection>

      <LegalSection title="How to Request a Refund">
        <LegalList
          items={[
            "First cancel the subscription renewal if you do not want future charges.",
            "Then contact the relevant billing or support channel associated with your purchase.",
            "Include the purchase email, charge date, and the reason for the request.",
            "Approved refunds are returned to the original payment method whenever possible.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Important Notes">
        <p>
          Canceling a subscription stops future renewals but does not
          automatically create a refund. Access generally remains active until
          the end of the already paid billing period unless otherwise required
          by law.
        </p>
      </LegalSection>

      <LegalSection title="Cases Where a Refund May Be Considered">
        <LegalList
          items={[
            "Duplicate charges for the same order.",
            "Unauthorized charges that are confirmed after investigation.",
            "Technical billing errors that caused a user to be charged incorrectly.",
            "Failure to deliver purchased access or credits due to a verified service-side issue.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Cases Normally Not Eligible">
        <LegalList
          items={[
            "Partial use of a subscription period.",
            "Unused credits remaining on an account after purchase or cancellation.",
            "Dissatisfaction with creative output where the service remained operational and accessible.",
            "Failure to cancel before the next automatic renewal date.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Review Window">
        <p>
          Refund requests should be submitted promptly after the relevant
          charge. As a general policy standard, requests made more than 7 days
          after the charge date may be declined unless required otherwise by law
          or consumer protection rules.
        </p>
      </LegalSection>

      <LegalSection title="Chargebacks and Disputes">
        <p>
          Before opening a payment dispute or chargeback, users should first
          request help through the relevant support or billing contact method
          made available by Midilli AI or the payment provider. Fraudulent or
          abusive chargeback activity may result in account suspension.
        </p>
      </LegalSection>

      <LegalSection title="Subscription Cancellation">
        <p>
          Users may cancel recurring subscriptions before the next renewal date.
          The subscription will generally remain active until the end of the
          already paid billing period unless otherwise stated at checkout or
          required by law.
        </p>
      </LegalSection>

      <LegalSection title="Quick Summary">
        <LegalList
          items={[
            "Canceling stops future renewal, not past charges.",
            "Duplicate, unauthorized, or clearly incorrect charges may be reviewed for refund.",
            "Used billing periods and consumed credits are usually not refundable.",
            "Approved refunds are typically returned to the original payment method.",
          ]}
        />
      </LegalSection>
    </LegalPageShell>
  );
}
