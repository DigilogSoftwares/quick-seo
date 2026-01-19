import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { topic, shop, payload } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);
  console.log("Payload:", payload);

  // Implement customer redaction logic here.
  // If your app has been granted access to the store's customer or order data, then it will receive a redaction request webhook with the resource IDs that you need to redact or delete.
  
  return new Response("OK", { status: 200 });
};
