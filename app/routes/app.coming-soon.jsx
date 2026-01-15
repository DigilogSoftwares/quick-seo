import React, { useState } from "react";

export default function ComingSoon() {
  const [showNotification, setShowNotification] = useState(true);

  return (
    <s-page heading="Coming Soon" inlineSize="base">
      {/* Notification Banner - Dismissible */}
      {showNotification && (
        <s-banner
          tone="info"
          dismissible={true}
          hidden={false}
          onDismiss={() => setShowNotification(false)}
        >
          <s-stack gap="small-200">
            <s-text type="strong">New Feature Alert</s-text>
            <s-paragraph>
              We're building something amazing! This page will be available
              soon.
            </s-paragraph>
          </s-stack>
        </s-banner>
      )}

      <s-section
        accessibilityLabel="Coming soon content section"
        padding="base"
      >
        <s-grid gap="large" justifyItems="center" paddingBlock="large-400">
          {/* Icon Container with subtle background */}
          <s-box
            maxInlineSize="200px"
            maxBlockSize="200px"
            background="subdued"
            borderRadius="large"
            padding="large-200"
          >
            <s-stack alignItems="center" justifyContent="center" gap="base">
              <s-icon type="clock" size="base" tone="info" />
            </s-stack>
          </s-box>

          {/* Main Content Area */}
          <s-grid justifyItems="center" maxInlineSize="600px" gap="large-100">
            {/* Heading and Description */}
            <s-stack alignItems="center" gap="base">
              <s-heading>We're Working on Something Special</s-heading>
              <s-paragraph>
                Our team is hard at work building an amazing new feature for
                you. This page is currently under construction and will be
                available soon.
              </s-paragraph>
            </s-stack>

            {/* Feature Preview Section */}
            <s-box
              background="subdued"
              borderRadius="base"
              padding="large"
              maxInlineSize="600px"
              border="base subdued"
            >
              <s-stack gap="large">
                <s-stack gap="small-200">
                  <s-text type="strong">What to Expect</s-text>
                  <s-divider />
                </s-stack>
                <s-stack gap="small-100">
                  <s-stack
                    gap="small-100"
                    direction="inline"
                    alignItems="center"
                  >
                    <s-icon type="check-circle" tone="success" size="small" />
                    <s-text>Enhanced user experience with modern design</s-text>
                  </s-stack>
                  <s-stack
                    gap="small-100"
                    direction="inline"
                    alignItems="center"
                  >
                    <s-icon type="check-circle" tone="success" size="small" />
                    <s-text>New powerful features to boost productivity</s-text>
                  </s-stack>
                  <s-stack
                    gap="small-100"
                    direction="inline"
                    alignItems="center"
                  >
                    <s-icon type="check-circle" tone="success" size="small" />
                    <s-text>Improved performance and reliability</s-text>
                  </s-stack>

                  <s-box paddingBlockEnd="small-100"></s-box>
                </s-stack>
              </s-stack>
            </s-box>

            {/* Call to Action Buttons */}
            <s-button-group gap="base">
              <s-button
                slot="secondary-actions"
                variant="secondary"
                href="/app"
              >
                Back to Home
              </s-button>
              <s-button
                slot="primary-action"
                variant="primary"
                href="https://digilogsoftwares.com/"
                target="_blank"
              >
                Learn More
              </s-button>
            </s-button-group>

            {/* Additional Help Section */}
            <s-stack gap="small-200" alignItems="center">
              <s-divider />
              <s-text color="subdued">
                Need help? Contact our support team or check out our
                documentation.
              </s-text>
              <s-stack direction="inline" gap="small-200">
                <s-link
                  href="https://help.shopify.com/en/"
                  target="_blank"
                  tone="neutral"
                >
                  Documentation
                </s-link>
                <s-text color="subdued">•</s-text>
                <s-link href="mailto:info@digilogsoftwares.com" tone="neutral">
                  Contact Support
                </s-link>
              </s-stack>
            </s-stack>
          </s-grid>
        </s-grid>
      </s-section>
    </s-page>
  );
}
