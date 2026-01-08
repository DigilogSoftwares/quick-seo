import { useState } from "react";

export default function AdditionalPage() {
  return (
    <s-page heading="Your Page Title" inlineSize="base">
      {/* Sidebar content (1/3) */}
      <s-section heading="Sidebar Settings" slot="aside">
        <s-text>This is the sidebar (1/3 width)</s-text>
        <s-select>
          <s-option value="active">Active</s-option>
          <s-option value="draft">Draft</s-option>
        </s-select>
      </s-section>
      {/* Main content area (2/3) */}
      <s-section heading="Main Content">
        <s-text>This is the main content area (2/3 width)</s-text>
        <s-text-field label="Title" />
        <s-text-area label="Description" />
      </s-section>
    </s-page>
  );
}
