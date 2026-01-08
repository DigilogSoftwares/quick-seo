export default function UI() {
  return (
    <s-page size="large" heading="Home Page">
      {/* <!-- Header Section --> */}
      <s-section>
        <s-stack gap="base" direction="vertical">
          <s-heading>URL Indexing Dashboard</s-heading>
          <s-text tone="subdued">
            Monitor and manage your URL indexing performance
          </s-text>
        </s-stack>
      </s-section>

      {/* <!-- Stats Cards --> */}
      <s-section>
        <s-grid gridtemplatecolumns="repeat(4, 1fr)" gap="base">
          {/* <!-- Total URLs Card --> */}
          <s-box
            padding="base"
            background="surface"
            border="base"
            borderradius="base"
          >
            <s-stack gap="small" direction="vertical">
              <s-text tone="subdued" size="small">
                Total URLs
              </s-text>
              <s-heading level="2">1,247</s-heading>
              <s-stack gap="small-300" align="center">
                <s-badge tone="success" color="strong">
                  ↑ 12%
                </s-badge>
                <s-text size="small" tone="subdued">
                  vs last month
                </s-text>
              </s-stack>
            </s-stack>
          </s-box>

          {/* <!-- Indexed URLs Card --> */}
          <s-box
            padding="base"
            background="surface"
            border="base"
            borderradius="base"
          >
            <s-stack gap="small" direction="vertical">
              <s-text tone="subdued" size="small">
                Indexed URLs
              </s-text>
              <s-heading level="2">1,089</s-heading>
              <s-stack gap="small-300" align="center">
                <s-badge tone="success" color="strong">
                  ↑ 8%
                </s-badge>
                <s-text size="small" tone="subdued">
                  vs last month
                </s-text>
              </s-stack>
            </s-stack>
          </s-box>

          {/* <!-- Pending URLs Card --> */}
          <s-box
            padding="base"
            background="surface"
            border="base"
            borderradius="base"
          >
            <s-stack gap="small" direction="vertical">
              <s-text tone="subdued" size="small">
                Pending
              </s-text>
              <s-heading level="2">124</s-heading>
              <s-stack gap="small-300" align="center">
                <s-badge tone="warning">⚠ 15</s-badge>
                <s-text size="small" tone="subdued">
                  need attention
                </s-text>
              </s-stack>
            </s-stack>
          </s-box>

          {/* <!-- Failed URLs Card --> */}
          <s-box
            padding="base"
            background="surface"
            border="base"
            borderradius="base"
          >
            <s-stack gap="small" direction="vertical">
              <s-text tone="subdued" size="small">
                Failed
              </s-text>
              <s-heading level="2">34</s-heading>
              <s-stack gap="small-300" align="center">
                <s-badge tone="critical">↓ 5%</s-badge>
                <s-text size="small" tone="subdued">
                  improved
                </s-text>
              </s-stack>
            </s-stack>
          </s-box>
        </s-grid>
      </s-section>

      {/* <!-- Quick Actions Banner --> */}
      <s-section>
        <s-banner tone="info" heading="Quick Actions">
          Submit new URLs for indexing or check the status of your recent
          submissions.
          <s-button-group slot="secondary-actions">
            <s-button variant="primary" onclick="handleAddURL()">
              Add New URL
            </s-button>
            <s-button onclick="handleBulkImport()">Bulk Import</s-button>
            <s-button onclick="handleRefresh()">Refresh Status</s-button>
          </s-button-group>
        </s-banner>
      </s-section>

      {/* <!-- Recent URLs Table --> */}
      <s-section heading="Recent URLs">
        <s-stack gap="base" direction="vertical">
          {/* <!-- Search and Filter Bar --> */}
          <s-stack gap="base" align="stretch">
            <s-search-field
              label="Search URLs"
              name="search"
              placeholder="Search by URL or status..."
              oninput="handleSearch(event)"
            ></s-search-field>
            <s-select name="status-filter" onchange="handleFilter(event)">
              <s-option value="all" selected>
                All Status
              </s-option>
              <s-option value="indexed">Indexed</s-option>
              <s-option value="pending">Pending</s-option>
              <s-option value="failed">Failed</s-option>
            </s-select>
          </s-stack>

          {/* <!-- URLs Table --> */}
          <s-box border="base" borderradius="base" background="surface">
            <s-table>
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Status</th>
                  <th>Last Checked</th>
                  <th>Response Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="urlTableBody">
                <tr>
                  <td>
                    <s-stack gap="small-300" direction="vertical">
                      <s-text weight="bold">
                        https://example.com/product/item-1
                      </s-text>
                      <s-text size="small" tone="subdued">
                        Product page
                      </s-text>
                    </s-stack>
                  </td>
                  <td>
                    <s-badge tone="success">Indexed</s-badge>
                  </td>
                  <td>
                    <s-text size="small">2 hours ago</s-text>
                  </td>
                  <td>
                    <s-text size="small">1.2s</s-text>
                  </td>
                  <td>
                    <s-button-group>
                      <s-button size="small" onclick="handleView(1)">
                        View
                      </s-button>
                      <s-button size="small" onclick="handleReindex(1)">
                        Reindex
                      </s-button>
                    </s-button-group>
                  </td>
                </tr>
                <tr>
                  <td>
                    <s-stack gap="small-300" direction="vertical">
                      <s-text weight="bold">
                        https://example.com/blog/post-1
                      </s-text>
                      <s-text size="small" tone="subdued">
                        Blog post
                      </s-text>
                    </s-stack>
                  </td>
                  <td>
                    <s-badge tone="warning">Pending</s-badge>
                  </td>
                  <td>
                    <s-text size="small">5 hours ago</s-text>
                  </td>
                  <td>
                    <s-text size="small">-</s-text>
                  </td>
                  <td>
                    <s-button-group>
                      <s-button size="small" onclick="handleView(2)">
                        View
                      </s-button>
                      <s-button size="small" onclick="handleReindex(2)">
                        Reindex
                      </s-button>
                    </s-button-group>
                  </td>
                </tr>
                <tr>
                  <td>
                    <s-stack gap="small-300" direction="vertical">
                      <s-text weight="bold">
                        https://example.com/category/electronics
                      </s-text>
                      <s-text size="small" tone="subdued">
                        Category page
                      </s-text>
                    </s-stack>
                  </td>
                  <td>
                    <s-badge tone="success">Indexed</s-badge>
                  </td>
                  <td>
                    <s-text size="small">1 day ago</s-text>
                  </td>
                  <td>
                    <s-text size="small">0.8s</s-text>
                  </td>
                  <td>
                    <s-button-group>
                      <s-button size="small" onclick="handleView(3)">
                        View
                      </s-button>
                      <s-button size="small" onclick="handleReindex(3)">
                        Reindex
                      </s-button>
                    </s-button-group>
                  </td>
                </tr>
                <tr>
                  <td>
                    <s-stack gap="small-300" direction="vertical">
                      <s-text weight="bold">
                        https://example.com/page/about
                      </s-text>
                      <s-text size="small" tone="subdued">
                        Static page
                      </s-text>
                    </s-stack>
                  </td>
                  <td>
                    <s-badge tone="critical">Failed</s-badge>
                  </td>
                  <td>
                    <s-text size="small">3 hours ago</s-text>
                  </td>
                  <td>
                    <s-text size="small">Timeout</s-text>
                  </td>
                  <td>
                    <s-button-group>
                      <s-button size="small" onclick="handleView(4)">
                        View
                      </s-button>
                      <s-button size="small" onclick="handleReindex(4)">
                        Reindex
                      </s-button>
                    </s-button-group>
                  </td>
                </tr>
                <tr>
                  <td>
                    <s-stack gap="small-300" direction="vertical">
                      <s-text weight="bold">
                        https://example.com/product/item-2
                      </s-text>
                      <s-text size="small" tone="subdued">
                        Product page
                      </s-text>
                    </s-stack>
                  </td>
                  <td>
                    <s-badge tone="info">Processing</s-badge>
                  </td>
                  <td>
                    <s-text size="small">30 minutes ago</s-text>
                  </td>
                  <td>
                    <s-spinner size="small"></s-spinner>
                  </td>
                  <td>
                    <s-button-group>
                      <s-button size="small" onclick="handleView(5)">
                        View
                      </s-button>
                      <s-button size="small" disabled>
                        Reindex
                      </s-button>
                    </s-button-group>
                  </td>
                </tr>
              </tbody>
            </s-table>
          </s-box>

          {/* <!-- Pagination --> */}
          <s-stack gap="base" align="center" justify="space-between">
            <s-text size="small" tone="subdued">
              Showing 1-5 of 1,247 URLs
            </s-text>
            <s-button-group>
              <s-button size="small" disabled>
                Previous
              </s-button>
              <s-button size="small">Next</s-button>
            </s-button-group>
          </s-stack>
        </s-stack>
      </s-section>

      {/* <!-- Sidebar with Settings --> */}
      <s-section heading="Quick Settings" slot="aside">
        <s-stack gap="base" direction="vertical">
          <s-box padding="base" background="subdued" borderradius="base">
            <s-stack gap="small" direction="vertical">
              <s-text weight="bold">Auto-Indexing</s-text>
              <s-text size="small" tone="subdued">
                Automatically submit new URLs for indexing
              </s-text>
              <s-switch
                name="auto-index"
                checked
                onchange="handleAutoIndex(event)"
              >
                Enabled
              </s-switch>
            </s-stack>
          </s-box>

          <s-box padding="base" background="subdued" borderradius="base">
            <s-stack gap="small" direction="vertical">
              <s-text weight="bold">Indexing Frequency</s-text>
              <s-text size="small" tone="subdued">
                How often to check URL status
              </s-text>
              <s-select name="frequency">
                <s-option value="daily" selected>
                  Daily
                </s-option>
                <s-option value="weekly">Weekly</s-option>
                <s-option value="monthly">Monthly</s-option>
              </s-select>
            </s-stack>
          </s-box>

          <s-box padding="base" background="subdued" borderradius="base">
            <s-stack gap="small" direction="vertical">
              <s-text weight="bold">Notifications</s-text>
              <s-text size="small" tone="subdued">
                Get notified about indexing status
              </s-text>
              <s-checkbox name="notify-success">
                Success notifications
              </s-checkbox>
              <s-checkbox name="notify-failure" checked>
                Failure notifications
              </s-checkbox>
            </s-stack>
          </s-box>

          <s-divider></s-divider>

          <s-button variant="primary" onclick="handleViewAnalytics()">
            View Full Analytics
          </s-button>
        </s-stack>
      </s-section>
    </s-page>
  );
}
