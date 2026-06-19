import "dotenv/config";
import { auth, handlers } from "./lib/auth";

async function main() {
  console.log("Importing handlers:", handlers);
  try {
    // Try to call GET handler with a mock request
    const req = new Request("http://localhost:3000/api/auth/providers");
    const res = await handlers.GET(req);
    console.log("GET /api/auth/providers status:", res.status);
    const text = await res.text();
    console.log("Response text:", text);
  } catch (err) {
    console.error("Auth error:", err);
  }
}

main().catch(console.error);
