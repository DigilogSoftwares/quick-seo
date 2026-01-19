import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { topic, shop, payload } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);
  console.log("Payload:", payload);

  // Implement customer data request logic here.
  // The payload contains the resource IDs of the customer data that you need to provide to the store owner directly.
  
  return new Response("OK", { status: 200 });
};
