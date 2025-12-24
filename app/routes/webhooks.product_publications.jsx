import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  console.log(`Received webhook on BACKEND`);
  const { topic, shop, session, payload } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  console.log("Webhook details:", {
    topic,
    shop,
    session,
    payload,
  });

  switch (topic) {
    case "PRODUCT_PUBLICATIONS_CREATE":
    case "PRODUCT_PUBLICATIONS_UPDATE":

    case "PRODUCT_PUBLICATIONS_DELETE":

    default:
      console.log("Unhandled topic:", topic);
  }

  return new Response();
};
