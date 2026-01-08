import { useState } from "react";

export default function AdditionalPage() {
  return (
    <form
      data-save-bar
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const formEntries = Object.fromEntries(formData);
        console.log("Form data", formEntries);
      }}
      onReset={(event) => {
        console.log("Handle discarded changes if necessary");
      }}
    >
      <s-page heading="Settings" inlineSize="small">
        {/* === */}
        {/* Store Information */}
        {/* === */}
        <s-section heading="Credential Information">
          <s-text-field
            label="Bing WebMaster Api Key"
            name="store-name"
            placeholder="Enter API Key"
          />

          <s-drop-zone
            accept=".json"
            label="Upload Google Console API Key"
            multiple
          />

          {/* <s-choice-list label="Primary currency" name="currency">
            <s-choice value="usd" selected>
              US Dollar ($)
            </s-choice>
            <s-choice value="cad">Canadian Dollar (CAD)</s-choice>
            <s-choice value="eur">Euro (€)</s-choice>
          </s-choice-list> */}
        </s-section>

        {/* === */}
        {/* Notifications */}
        {/* === */}
        <s-section heading="Submission settings">
          <s-choice-list
            label="Prefered Content Type"
            name="notifications-type"
            multiple
          >
            <s-choice value="new-order" selected>
              Products
            </s-choice>
            <s-choice value="low-stock" selected>
              Collections
            </s-choice>
            <s-choice value="customer-review" selected>
              Pages
            </s-choice>
            <s-choice value="shipping-updates" selected>
              Blog posts
            </s-choice>
          </s-choice-list>
        </s-section>

        {/* === */}
        {/* Tools */}
        {/* === */}
        <s-section heading="Tools">
          <s-stack
            gap="none"
            border="base"
            borderRadius="base"
            overflow="hidden"
          >
            <s-box padding="small-100">
              <s-grid
                gridTemplateColumns="1fr auto"
                alignItems="center"
                gap="base"
              >
                <s-box>
                  <s-heading>Reset app settings</s-heading>
                  <s-paragraph color="subdued">
                    Reset all settings to their default values. This action
                    cannot be undone.
                  </s-paragraph>
                </s-box>
                <s-button tone="critical">Reset</s-button>
              </s-grid>
            </s-box>
            <s-box paddingInline="small-100">
              <s-divider />
            </s-box>

            <s-box padding="small-100">
              <s-grid
                gridTemplateColumns="1fr auto"
                alignItems="center"
                gap="base"
              >
                <s-box>
                  <s-heading>Export settings</s-heading>
                  <s-paragraph color="subdued">
                    Download a backup of all your current settings.
                  </s-paragraph>
                </s-box>
                <s-button>Export</s-button>
              </s-grid>
            </s-box>
          </s-stack>
        </s-section>
      </s-page>
    </form>
  );
}
