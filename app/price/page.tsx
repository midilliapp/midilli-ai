import type { Metadata } from "next";

import {
  LegalCard,
  LegalCardGrid,
  LegalList,
  LegalPageShell,
  LegalSection,
} from "../components/legal-page-shell";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Midilli AI pricing for subscriptions and one-time credit packs.",
};

const subscriptionPlans = [
  {
    name: "Free",
    price: "$0",
    quota: "10 generations to start",
    summary: "Try core features before upgrading.",
    items: [
      "2 AI models",
      "Watermarked exports",
      "Personal use only",
      "No credit card required",
    ],
  },
  {
    name: "Basic",
    price: "$9.99 / month",
    quota: "150 generations / month",
    summary: "For individual creators with recurring usage.",
    items: [
      "5 AI models unlocked",
      "Watermark-free exports",
      "Session history",
      "Personal use license",
    ],
  },
  {
    name: "Pro",
    price: "$19 / month",
    quota: "600 generations / month",
    summary: "For active creators and commercial workflows.",
    items: [
      "All 10 AI models",
      "Image-to-video included",
      "Commercial license",
      "Priority queue",
    ],
  },
  {
    name: "Ultra",
    price: "$49 / month",
    quota: "2,000 generations / month",
    summary: "For power users and teams with higher volume needs.",
    items: [
      "4K video exports",
      "Always-first queue",
      "Dedicated support",
      "API access roadmap",
    ],
  },
];

const creditPacks = [
  "Starter: 100 credits for $5",
  "Popular: 300 credits for $12",
  "Value: 700 credits for $22",
  "Power Pack: 2,000 credits for $50",
];

export default function PricePage() {
  return (
    <LegalPageShell
      eyebrow="Pricing"
      title="Midilli AI Plans and Credit Packs"
      description="Choose a Midilli AI plan for images, motion concepts, and creative generation workflows. Subscriptions renew automatically until canceled. One-time credit packs are also available for extra usage."
      lastUpdated="March 21, 2026"
    >
      <section
        style={{
          marginTop: 18,
          padding: 28,
          borderRadius: 28,
          background: "rgba(15,15,26,0.84)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ color: "#8f8aa8", fontSize: 13, marginBottom: 10 }}>
          Monthly plans
        </div>
        <div
          style={{
            maxWidth: 660,
            color: "#c6c2d7",
            fontSize: 15,
            lineHeight: 1.8,
            marginBottom: 22,
          }}
        >
          Midilli AI subscriptions are designed for creators who need fast image
          generation, motion workflows, and predictable monthly usage. Plans
          renew automatically until canceled.
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
          }}
        >
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.name}
              style={{
                padding: plan.name === "Pro" ? "22px" : "20px",
                borderRadius: 22,
                background:
                  plan.name === "Pro"
                    ? "linear-gradient(155deg, rgba(118,80,255,0.2) 0%, rgba(148,70,245,0.12) 50%, rgba(220,70,175,0.08) 100%)"
                    : "rgba(255,255,255,0.04)",
                border:
                  plan.name === "Pro"
                    ? "1px solid rgba(148,85,247,0.42)"
                    : "1px solid rgba(255,255,255,0.08)",
                boxShadow:
                  plan.name === "Pro"
                    ? "0 18px 50px rgba(108,72,252,0.18)"
                    : "none",
              }}
            >
              {plan.name === "Pro" && (
                <div
                  style={{
                    display: "inline-flex",
                    marginBottom: 12,
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: "rgba(124,92,252,0.16)",
                    border: "1px solid rgba(148,85,247,0.28)",
                    color: "#d6cbff",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Popular
                </div>
              )}
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 22,
                }}
              >
                {plan.name}
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 34,
                  letterSpacing: "-0.04em",
                }}
              >
                {plan.price}
              </div>
              <div style={{ marginTop: 10, color: "#d5d1e4", fontSize: 15 }}>
                {plan.quota}
              </div>
              <p style={{ margin: "12px 0 0", color: "#8f8aa8", lineHeight: 1.7, fontSize: 14 }}>
                {plan.summary}
              </p>
              <LegalList items={plan.items} />
            </div>
          ))}
        </div>
      </section>

      <LegalSection title="Subscription Plans">
        <p>
          Midilli AI offers recurring subscription plans for individual users
          and one-time credit packs for additional generation volume. Features,
          monthly usage allowances, export rights, and available models depend
          on the selected plan.
        </p>
      </LegalSection>

      <LegalSection title="One-Time Credit Packs">
        <p>
          Credit packs increase the available generation balance for a user
          account and do not create a recurring subscription by themselves.
        </p>
        <LegalCardGrid>
          {creditPacks.map((pack) => (
            <LegalCard key={pack} title={pack.split(":")[0]}>
              {pack.replace(`${pack.split(":")[0]}: `, "")}
            </LegalCard>
          ))}
        </LegalCardGrid>
      </LegalSection>

      <LegalSection title="Billing and Renewals">
        <LegalCardGrid>
          <LegalCard title="Automatic renewal">
            Paid subscriptions renew automatically at the end of each billing
            cycle unless canceled before the next renewal date.
          </LegalCard>
          <LegalCard title="Plan changes">
            Users may upgrade, downgrade, or cancel renewal where billing
            controls are available in the product or checkout flow.
          </LegalCard>
          <LegalCard title="Taxes and currency">
            Final checkout pricing may vary by billing region, currency, and
            applicable taxes or local fees.
          </LegalCard>
        </LegalCardGrid>
        <LegalList
          items={[
            "Paid subscriptions renew automatically each billing cycle until canceled.",
            "Users can change plans, cancel renewal, or purchase additional credits where the product or billing portal supports it.",
            "Taxes, local fees, and billing currency may vary by jurisdiction and checkout configuration.",
            "Promotional pricing, trials, or launch offers may be time-limited and may be changed or withdrawn in the future.",
          ]}
        />
      </LegalSection>

      <LegalSection title="What Customers Are Buying">
        <LegalList
          items={[
            "Access to Midilli AI software for AI-assisted image and video generation.",
            "Usage entitlements such as monthly generations or account credits.",
            "Feature access based on the selected plan tier, including model availability and export options.",
            "Commercial usage rights only where explicitly included in the purchased plan.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Billing Summary">
        <LegalList
          items={[
            "Subscriptions are recurring digital software purchases.",
            "Credit packs are one-time digital purchases added to an account balance.",
            "Refund handling is described separately at midilli.app/refund.",
            "Terms of use and privacy handling are described at midilli.app/terms and midilli.app/privacy.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Frequently Asked Questions">
        <LegalList
          items={[
            "Can I switch plans? Yes. Plan changes may take effect immediately or on the next billing cycle depending on checkout and billing settings.",
            "Do subscriptions renew automatically? Yes. Paid plans renew automatically until canceled.",
            "Do you offer commercial usage? Commercial usage is included only on plans where commercial rights are expressly listed.",
            "Can I buy extra usage without upgrading? Yes. One-time credit packs can be used for additional generation volume.",
          ]}
        />
      </LegalSection>
    </LegalPageShell>
  );
}
