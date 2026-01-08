import { useState } from "react";
import prisma from "../db.server";
import { StatBox } from "../components/StatBox";
import { authenticate } from "../shopify.server";
import { ClientOnly } from "../components/ClientOnly";
import { SetupGuide } from "../components/SetupGuide";
import { useLoaderData, useRouteError } from "react-router";
import {
  timeAgo,
  getToneFromStatus,
  getActionLabel,
  getTypeFromPath,
  extractPath,
} from "../functions/mainpage";

export const loader = async ({ request }) => {
  const { admin, session, redirect, cors, billing, scopes, sessionToken } =
    await authenticate.admin(request);

  const latest_changes = await prisma.urlEntry.findMany({
    where: {
      shop: session.shop,
    },
    orderBy: {
      lastEventAt: "desc",
    },
    take: 5,
  });

  return { entries: latest_changes };
};

export default function AdditionalPage() {
  const { entries } = useLoaderData();
  const ITEMS = [
    {
      id: 0,
      title: "Add your first product",
      description:
        "If checking out takes longer than 30 seconds, half of all shoppers quit. Let your customers check out quickly with a one-step payment solution.",
      image: {
        url: "https://cdn.shopify.com/shopifycloud/shopify/assets/admin/home/onboarding/shop_pay_task-70830ae12d3f01fed1da23e607dc58bc726325144c29f96c949baca598ee3ef6.svg",
        alt: "Illustration highlighting ShopPay integration",
      },
      complete: true,
      primaryButton: {
        content: "Add product",
        props: {
          url: "https://www.example.com",
          external: true,
        },
      },
      secondaryButton: {
        content: "Import products",
        props: {
          url: "https://www.example.com",
          external: true,
        },
      },
    },
    {
      id: 1,
      title: "Share your online store",
      description:
        "Drive awareness and traffic by sharing your store via SMS and email with your closest network, and on communities like Instagram, TikTok, Facebook, and Reddit.",
      image: {
        url: "https://cdn.shopify.com/shopifycloud/shopify/assets/admin/home/onboarding/detail-images/home-onboard-share-store-b265242552d9ed38399455a5e4472c147e421cb43d72a0db26d2943b55bdb307.svg",
        alt: "Illustration showing an online storefront with a 'share' icon in top right corner",
      },
      complete: false,
      primaryButton: {
        content: "Copy store link",
        props: {
          onAction: () => console.log("copied store link!"),
        },
      },
    },
    {
      id: 2,
      title: "Translate your store",
      description:
        "Translating your store improves cross-border conversion by an average of 13%. Add languages for your top customer regions for localized browsing, notifications, and checkout.",
      image: {
        url: "https://cdn.shopify.com/b/shopify-guidance-dashboard-public/nqjyaxwdnkg722ml73r6dmci3cpn.svgz",
      },
      complete: false,
      primaryButton: {
        content: "Add a language",
        props: {
          url: "https://www.example.com",
          external: true,
        },
      },
    },
  ];
  const stats = {
    orders: [13, 20, 18, 50, 8, 15, 23],
    reviews: [13, 3, 5, 6, 5, 2, 8],
    returns: [5, 6, 5, 8, 4, 3, 1],
  };

  // States
  const [visible, setVisible] = useState({
    banner: true,
    setupGuide: true,
    calloutCard: true,
    featuredApps: true,
  });
  const [showGuide, setShowGuide] = useState(true);
  const [items, setItems] = useState(ITEMS);

  const onStepComplete = async (id) => {
    try {
      // API call to update completion state in DB, etc.
      await new Promise((res) =>
        setTimeout(() => {
          res();
        }, [1000]),
      );

      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, complete: !item.complete } : item,
        ),
      );
    } catch (e) {
      console.error(e);
    }
  };

  if (!showGuide)
    return (
      <s-button onClick={() => setShowGuide(true)}>Show Setup Guide</s-button>
    );

  return (
    <s-page>
      <s-button slot="primary-action">Create puzzle</s-button>
      <s-button slot="secondary-actions">Browse templates</s-button>
      <s-button slot="secondary-actions">Import image</s-button>

      {/* === */}
      {/* Setup Guide */}
      {/* Keep instructions brief and direct. Only ask merchants for required information. */}
      {/* If dismissed, use local storage or a database entry to avoid showing this section again to the same user. */}
      {/* === */}
      {visible.setupGuide && (
        <s-section padding="none">
          <SetupGuide
            onDismiss={() => {
              setShowGuide(false);
              setItems(ITEMS);
            }}
            onStepComplete={onStepComplete}
            items={items}
          />
        </s-section>
      )}

      {/* === */}
      {/* Metrics cards */}
      {/* Your app homepage should provide merchants with quick statistics or status updates that help them understand how the app is performing for them. */}
      {/* === */}

      <s-section padding="base" paddingBlockStart="large">
        <s-grid gridTemplateColumns="repeat(4, 1fr)" gap="small">
          {/* Card 1 */}
          <s-clickable
            href="#"
            paddingBlock="small-400"
            paddingInline="small-100"
            borderRadius="base"
          >
            <s-grid gap="small-300">
              <s-heading>Total URLs</s-heading>
              <s-stack direction="inline" gap="small-200">
                <s-text>1,247</s-text>
                <s-badge tone="success" icon="arrow-up">
                  12%
                </s-badge>
              </s-stack>
            </s-grid>
          </s-clickable>

          {/* Card 2 */}
          <s-clickable
            href="#"
            paddingBlock="small-400"
            paddingInline="small-100"
            borderRadius="base"
          >
            <s-grid gap="small-300">
              <s-heading>Indexed</s-heading>
              <s-stack direction="inline" gap="small-200">
                <s-text>1,089</s-text>
                <s-badge tone="success" icon="arrow-up">
                  8%
                </s-badge>
              </s-stack>
            </s-grid>
          </s-clickable>

          {/* Card 3 */}
          <s-clickable
            href="#"
            paddingBlock="small-400"
            paddingInline="small-100"
            borderRadius="base"
          >
            <s-grid gap="small-300">
              <s-heading>Pending</s-heading>
              <s-stack direction="inline" gap="small-200">
                <s-text>124</s-text>
                <s-badge tone="warning">15%</s-badge>
              </s-stack>
            </s-grid>
          </s-clickable>

          {/* Card 4 */}
          <s-clickable
            href="#"
            paddingBlock="small-400"
            paddingInline="small-100"
            borderRadius="base"
          >
            <s-grid gap="small-300">
              <s-heading>Failed</s-heading>
              <s-stack direction="inline" gap="small-200">
                <s-text>34</s-text>
                <s-badge tone="critical" icon="arrow-down">
                  5%
                </s-badge>
              </s-stack>
            </s-grid>
          </s-clickable>
        </s-grid>
      </s-section>

      {/* === */}
      {/* Callout Card */}
      {/* If dismissed, use local storage or a database entry to avoid showing this section again to the same user. */}
      {/* === */}

      <s-section
        padding="base"
        accessibilityLabel="URLs table section"
        heading="Recent Submissions"
      >
        <s-table>
          <s-grid slot="filters" gap="small-200" gridTemplateColumns="1fr auto">
            <s-text-field
              label="Search URLs"
              labelAccessibilityVisibility="exclusive"
              icon="search"
              placeholder="Search all URLs"
            />
            <s-button
              icon="sort"
              variant="secondary"
              accessibilityLabel="Sort"
              interestFor="sort-tooltip"
              commandFor="sort-actions"
            />
            <s-tooltip id="sort-tooltip">
              <s-text>Sort</s-text>
            </s-tooltip>
            <s-popover id="sort-actions">
              <s-stack gap="none">
                <s-box padding="small">
                  <s-choice-list label="Sort by" name="Sort by">
                    <s-choice value="url" selected>
                      URL
                    </s-choice>
                    <s-choice value="event">Event</s-choice>
                    <s-choice value="occur-at">Occurred at</s-choice>
                    <s-choice value="status">Status</s-choice>
                  </s-choice-list>
                </s-box>
                <s-divider />
                <s-box padding="small">
                  <s-choice-list label="Order by" name="Order by">
                    <s-choice value="asc" selected>
                      A-Z
                    </s-choice>
                    <s-choice value="desc">Z-A</s-choice>
                  </s-choice-list>
                </s-box>
              </s-stack>
            </s-popover>
          </s-grid>
          <s-table-header-row>
            <s-table-header listSlot="primary">URL</s-table-header>
            <s-table-header>Event</s-table-header>
            <s-table-header>Occurred at</s-table-header>
            <s-table-header listSlot="secondary">Status</s-table-header>
          </s-table-header-row>
          <s-table-body>
            {entries.map((e, i) => {
              const path = extractPath(e.originalUrl, e.shop);
              const action = getActionLabel(path, e.indexAction);
              const occurred = timeAgo(new Date(e.lastEventAt));
              const toneInfo = getToneFromStatus(e.status);

              return (
                <s-table-row clickDelegate={`url-${i + 1}-checkbox`}>
                  <s-table-cell>
                    <s-stack direction="inline" gap="small" alignItems="center">
                      <s-link href={path}>{path}</s-link>
                    </s-stack>
                  </s-table-cell>

                  <s-table-cell>
                    <s-text>{action}</s-text>
                  </s-table-cell>

                  <s-table-cell>{occurred}</s-table-cell>

                  <s-table-cell>
                    <s-badge color="base" tone={toneInfo.tone}>
                      {toneInfo.label}
                    </s-badge>
                  </s-table-cell>
                </s-table-row>
              );
            })}
          </s-table-body>
        </s-table>
        <s-divider />
        <s-stack
          direction="inline"
          alignItems="center"
          justifyContent="center"
          paddingBlockStart="base"
        >
          <s-link href="/submissions">View all submissions</s-link>
        </s-stack>
      </s-section>

      <ClientOnly>
        <s-box paddingBlock="large">
          <s-stack gap="large">
            {/* Header */}
            <s-stack direction="block" gap="small-500">
              <s-heading>Daily Stats Example</s-heading>
              <s-text color="subdued">
                Shows rate of change from first entry of chart data to today
              </s-text>
            </s-stack>

            {/* Stats */}
            <s-grid gridTemplateColumns="repeat(3, 1fr)" columnGap="base">
              <s-grid-item>
                <StatBox
                  title="Orders"
                  value={stats.orders.at(-1)}
                  data={stats.orders}
                />
              </s-grid-item>

              <s-grid-item>
                <StatBox
                  title="Reviews"
                  value={stats.reviews.at(-1)}
                  data={stats.reviews}
                />
              </s-grid-item>

              <s-grid-item>
                <StatBox
                  title="Returns"
                  value={stats.returns.at(-1)}
                  data={stats.returns}
                />
              </s-grid-item>
            </s-grid>
          </s-stack>
        </s-box>
      </ClientOnly>

      {/* === */}
      {/* News */}
      {/* === */}
      <s-section>
        <s-heading>News</s-heading>
        <s-grid
          gridTemplateColumns="repeat(auto-fit, minmax(240px, 1fr))"
          gap="base"
        >
          {/* News item 1 */}
          <s-grid
            background="base"
            border="base"
            borderRadius="base"
            padding="base"
            gap="small-400"
          >
            <s-text>Jan 21, 2025</s-text>
            <s-link href="/news/new-shapes-and-themes">
              <s-heading>New puzzle shapes and themes added</s-heading>
            </s-link>
            <s-paragraph>
              We've added 5 new puzzle piece shapes and 3 seasonal themes to
              help you create more engaging and unique puzzles for your
              customers.
            </s-paragraph>
          </s-grid>
          {/* News item 2 */}
          <s-grid
            background="base"
            border="base"
            borderRadius="base"
            padding="base"
            gap="small-400"
          >
            <s-text>Nov 6, 2024</s-text>
            <s-link href="/news/puzzle-difficulty-customization">
              <s-heading>Puzzle difficulty customization features</s-heading>
            </s-link>
            <s-paragraph>
              Now you can fine-tune the difficulty of your puzzles with new
              rotation controls, edge highlighting options, and piece
              recognition settings.
            </s-paragraph>
          </s-grid>
        </s-grid>
        <s-stack
          direction="inline"
          alignItems="center"
          justifyContent="center"
          paddingBlockStart="base"
        >
          <s-link href="/news">See all news items</s-link>
        </s-stack>
      </s-section>

      {/* === */}
      {/* Featured apps */}
      {/* If dismissed, use local storage or a database entry to avoid showing this section again to the same user. */}
      {/* === */}
      {visible.featuredApps && (
        <s-section>
          <s-grid
            gridTemplateColumns="1fr auto"
            alignItems="center"
            paddingBlockEnd="small-400"
          >
            <s-heading>Featured apps</s-heading>
            <s-button
              onClick={() => setVisible({ ...visible, featuredApps: false })}
              icon="x"
              tone="neutral"
              variant="tertiary"
              accessibilityLabel="Dismiss featured apps section"
            ></s-button>
          </s-grid>
          <s-grid
            gridTemplateColumns="repeat(auto-fit, minmax(240px, 1fr))"
            gap="base"
          >
            {/* Featured app 1 */}
            <s-clickable
              href="https://apps.shopify.com/flow"
              border="base"
              borderRadius="base"
              padding="base"
              inlineSize="100%"
              accessibilityLabel="Download Shopify Flow"
            >
              <s-grid
                gridTemplateColumns="auto 1fr auto"
                alignItems="stretch"
                gap="base"
              >
                <s-thumbnail
                  size="small"
                  src="https://cdn.shopify.com/app-store/listing_images/15100ebca4d221b650a7671125cd1444/icon/CO25r7-jh4ADEAE=.png"
                  alt="Shopify Flow icon"
                />
                <s-box>
                  <s-heading>Shopify Flow</s-heading>
                  <s-paragraph>Free</s-paragraph>
                  <s-paragraph>
                    Automate everything and get back to business.
                  </s-paragraph>
                </s-box>
                <s-stack justifyContent="start">
                  <s-button
                    href="https://apps.shopify.com/flow"
                    icon="download"
                    accessibilityLabel="Download Shopify Flow"
                  />
                </s-stack>
              </s-grid>
            </s-clickable>
            {/* Featured app 2 */}
            <s-clickable
              href="https://apps.shopify.com/planet"
              border="base"
              borderRadius="base"
              padding="base"
              inlineSize="100%"
              accessibilityLabel="Download Shopify Planet"
            >
              <s-grid
                gridTemplateColumns="auto 1fr auto"
                alignItems="stretch"
                gap="base"
              >
                <s-thumbnail
                  size="small"
                  src="https://cdn.shopify.com/app-store/listing_images/87176a11f3714753fdc2e1fc8bbf0415/icon/CIqiqqXsiIADEAE=.png"
                  alt="Shopify Planet icon"
                />
                <s-box>
                  <s-heading>Shopify Planet</s-heading>
                  <s-paragraph>Free</s-paragraph>
                  <s-paragraph>
                    Offer carbon-neutral shipping and showcase your commitment.
                  </s-paragraph>
                </s-box>
                <s-stack justifyContent="start">
                  <s-button
                    href="https://apps.shopify.com/planet"
                    icon="download"
                    accessibilityLabel="Download Shopify Planet"
                  />
                </s-stack>
              </s-grid>
            </s-clickable>
          </s-grid>
        </s-section>
      )}
    </s-page>
  );
}
