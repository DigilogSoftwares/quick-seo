import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { topic, shop, payload } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);
  console.log("Payload:", payload);

  // Only act on redact/uninstall-related topics
  if (topic !== "shop/redact") {
    return new Response("Ignored", { status: 200 });
  }

  try {
    await db.$transaction([
      db.UrlEntry.deleteMany({
        where: { shop },
      }),

      db.IndexTask.deleteMany({
        where: { shop },
      }),

      db.Session.deleteMany({
        where: { shop },
      }),

      db.ShopFeatureStates.deleteMany({
        where: { shop },
      }),

      db.Auth.deleteMany({
        where: { shop },
      }),
    ]);

    console.log(`✅ Successfully deleted all data for shop: ${shop}`);
  } catch (error) {
    console.error(`❌ Failed to delete data for shop: ${shop}`, error);
    return new Response("Failed", { status: 500 });
  }

  return new Response("OK", { status: 200 });
};
