import {
  json,
  serve,
  validateRequest,
} from "https://deno.land/x/sift@0.1.7/mod.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.26.0/mod.ts";
import { SettingsSchema } from "./types.ts";

async function handleRequest(request: Request) {
  const { error } = await validateRequest(request, {
    POST: {},
  });

  if (error) {
    return json(
      { response_type: "ephemeral", text: error.message },
      { status: error.status },
    );
  }

  const mongoUrl = Deno.env.get("MONGODB_URL");
  if (!mongoUrl) {
    return json({
      response_type: "ephemeral",
      text: "Environment variable `MONGODB_URL` not set.",
    });
  }
  const client = new MongoClient();

  try {
    await client.connect(mongoUrl);

    const db = client.database("jukebox");
    const settings = db.collection<SettingsSchema>("settings");
    const slackMessage = await settings.findOne({ key: "slack" });

    return json(slackMessage.value.currentTrack);
  } catch (error) {
    // If something goes wrong in the above block, let's log the error
    // and return a generic error to the user.
    console.log(error);
    return json(
      {
        response_type: "ephemeral",
        text: "Error fetching the jukebox data. Please try again.",
      },
      { status: 500 },
    );
  }
}

serve({
  "/": handleRequest,
});
