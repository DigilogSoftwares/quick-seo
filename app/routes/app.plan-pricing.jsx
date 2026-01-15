import { useEffect } from "react";
import { useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useLoaderData, useRouteError } from "react-router";
import { authenticate, MONTHLY_PLAN, ANNUAL_PLAN } from "../shopify.server";

import { PricingCard } from "../components/PricingCard";
import { Accordion } from "../components/Accordion";

export const loader = async ({ request }) => {
  const { session, billing } = await authenticate.admin(request);

  const { hasActivePayment, appSubscriptions } = await billing.check({
    plans: [MONTHLY_PLAN, ANNUAL_PLAN],
    isTest: true,
  });

  console.log("hasActivePayment");
  console.log(hasActivePayment);
  console.log(appSubscriptions);

  // if (!hasActivePayment) {
  //   await billing.require({
  //     plans: [MONTHLY_PLAN, ANNUAL_PLAN],
  //     isTest: true,
  //     onFailure: async () =>
  //       billing.request({
  //         plan: MONTHLY_PLAN,
  //         isTest: true,
  //         returnUrl: `${process.env.SHOPIFY_APP_URL}/app`,
  //       }),
  //   });
  // }

  return {
    shop: session.shop,
  };

  await billing.require({
    plans: [MONTHLY_PLAN],
    isTest: true,
    onFailure: async () => billing.request({ plan: MONTHLY_PLAN }),
  });

  return new Response(
    JSON.stringify({
      shop: session.shop,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
};

export default function PricingPage() {
  const { shop } = useLoaderData();
  console.log(shop);

  const faqData = [
    {
      id: 1000,
      title:
        "Are there any limits on how many URLs I can index on the Standard plan?",
      content: (
        <s-text>
          All plans include unlimited URL indexing until your indexing engine
          quota is reached.
        </s-text>
      ),
    },
    {
      id: 7,
      title: "What should I do if a URL fails to submit?",
      content: (
        <s-text>
          Our integration will retry any URLs that fail. For persistent problems
          or unclear error messages, please contact our support team for
          assistance.
        </s-text>
      ),
    },
    {
      id: 1,
      title:
        "Are there any limitations to the number of URLs that can be submitted?",
      content: (
        <s-text>
          There isn't an official limit on the number of URLs that can be
          submitted daily. It may vary per search engine. If you start seeing
          requests with status Failed (multiples times), get in touch with us
          and we will help!
        </s-text>
      ),
    },
    {
      id: 2,
      title: "Which types of pages are submitted to Indexing Engine?",
      content: (
        <s-text>
          We support Products, Collections, Blog Posts and Shopify Pages.
        </s-text>
      ),
    },
    {
      id: 0,
      title: "Who can I contact for support or more questions?",
      content: (
        <s-text>
          For support inquiries or more detailed questions, please contact our
          customer service team via email at{" "}
          <strong> info@digilogsoftwares.com </strong>.
        </s-text>
      ),
    },
  ];

  return (
    <s-page>
      <h1 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>
        Choose plan
      </h1>
      <p>Unlock all features and start your 21-day free trial.</p>
      <s-box paddingBlockStart="small" paddingBlockEnd="large">
        <s-stack
          direction="inline"
          gap="large"
          alignItems="center"
          justifyContent="start"
        >
          <PricingCard
            title="Standard"
            description="This is a great plan for stores that are just starting out"
            features={[
              "Automatic Submits URL for Indexing ",
              "Retry failed submissions",
              "Manual URL submissions",
              "Submission Records",
            ]}
            price="$6"
            frequency="month"
            button={{
              content: "Select Plan",
              props: {
                variant: "primary",
                onClick: () => console.log("clicked plan!"),
              },
            }}
          />
          <PricingCard
            title="Advanced"
            featuredText="Most Popular"
            description="For stores that are growing and need a long term reliable solution"
            features={[
              "Process up to 10,000 urls/day",
              "Handle Google and Web Master indexing",
              "Submission Analytics feature",
              "Ai powered indexing strategy",
              "24/7 Customer Support",
            ]}
            price="$50"
            frequency="year"
            button={{
              content: "Select Plan",
              props: {
                variant: "primary",
                onClick: () => console.log("clicked plan!"),
              },
            }}
          />
          <PricingCard
            title="Premium"
            description="The best of the best, for stores that have the highest update frequency"
            unfeaturedText="Not Eligible"
            features={[
              "Process up to 100,000 urls/day",
              "Ai powered SEO strategy",
              "Store Media Content Optimization",
              "Advance Ad and Audience suggestions",
            ]}
            price="$120"
            frequency="month"
            button={{
              content: "Select Plan",
              props: {
                variant: "primary",
                disabled: true,
                onClick: () => console.log("clicked plan!"),
              },
            }}
          />
        </s-stack>
      </s-box>
      <br></br>
      <s-divider color="strong" />
      <br></br>
      <h1 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>FAQs</h1>
      <p>Common questions about plans, indexing quotas, and technical setup.</p>
      <s-box paddingBlockStart="large">
        <Accordion items={faqData} />
      </s-box>
      <s-box paddingBlockStart="large-500" paddingBlockEnd="large-500" />
      <s-box paddingBlockStart="large-500" paddingBlockEnd="large-500" />
      <s-box paddingBlockStart="large-500" paddingBlockEnd="large-500" />
    </s-page>
  );
}
