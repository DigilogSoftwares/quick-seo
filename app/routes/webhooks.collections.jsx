import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  console.log(`Received webhook on BACKEND`);
  const { shop, session, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  switch (topic) {
    case "COLLECTION_PUBLICATIONS_CREATE":
    case "COLLECTION_PUBLICATIONS_UPDATE":

    case "COLLECTION_PUBLICATIONS_DELETE":

    default:
      console.log("Unhandled topic:", topic);
  }

  return new Response();
};
