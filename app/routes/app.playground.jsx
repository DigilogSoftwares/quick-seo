import { PricingCard } from "../components/PricingCard";
import { Accordion } from "../components/Accordion";

export default function PlayGround() {
  return (
    <s-page>
      <h1 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>
        Choose plan
      </h1>
      <p>Unlock all features and start your 7-day free trial..</p>
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
              "Process up to 1,000 orders/mo",
              "Amazing feature",
              "Another really cool feature",
              "24/7 Customer Support",
            ]}
            price="$19"
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
            description="For stores that are growing and need a reliable solution to scale with them"
            features={[
              "Process up to 10,000 orders/mo",
              "Amazing feature",
              "Another really cool feature",
              "24/7 Customer Support",
            ]}
            price="$49"
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
            title="Premium"
            description="The best of the best, for stores that have the highest order processing needs"
            features={[
              "Process up to 100,000 orders/mo",
              "Amazing feature",
              "Another really cool feature",
              "24/7 Customer Support",
            ]}
            price="$99"
            frequency="month"
            button={{
              content: "Select Plan",
              props: {
                variant: "primary",
                onClick: () => console.log("clicked plan!"),
              },
            }}
          />
        </s-stack>
      </s-box>

      <s-box paddingBlockStart="large">
        <Accordion />
      </s-box>
    </s-page>
  );
}
