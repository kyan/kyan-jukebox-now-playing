import { listenAndServe } from "https://deno.land/std@0.114.0/http/server.ts";
// import { MongoClient } from "https://deno.land/x/mongo@v0.28.0/mod.ts";
// Using master branch in github until new release is made
import { MongoClient } from "https://raw.githubusercontent.com/denodrivers/deno_mongo/main/mod.ts";
import { SettingsSchema } from "./types.ts";

async function handleRequest(request: Request) {
  const mongoUrl = Deno.env.get("MONGODB_URL");
  if (!mongoUrl) {
    return new Response(null, {
      status: 422,
      statusText: "Environment variable `MONGODB_URL` not set.",
    });
  }
  const client = new MongoClient();

  try {
    await client.connect(mongoUrl);

    const db = client.database("jukebox-production");
    const settings = db.collection<SettingsSchema>("settings");
    const slackMessage = await settings.findOne({ key: "slack" }, { noCursorTimeout: false });
    const currentTrack = slackMessage?.value?.currentTrack;

    // The driver does not handle re-connecting which is why we
    // create a new connection every time and then close it. There are
    // not many users of this application.
    client.close()

    if (request.method == "POST") {
      return new Response(JSON.stringify(currentTrack), {
        headers: {
          "content-type": "application/json; charset=UTF-8",
        },
      });
    }

    const [title, artist, album] = currentTrack.blocks[2].text.text.split("\n")
    const image = currentTrack.blocks[2].accessory.image_url
    const nowPlaying = {
      title: title.trim().replace(/\*/g, ""),
      artist: artist.trim(),
      album: album.trim(),
      image,
      rating: currentTrack.blocks[4].fields[0]?.text?.replace(/\*/g, ""),
      "voted_by": currentTrack.blocks[4].fields[1]?.text?.replace(/\*/g, ""),
      played: currentTrack.blocks[4].fields[2]?.text?.replace(/\*/g, ""),
      "last_played": currentTrack.blocks[4].fields[3]?.text?.replace(/\*/g, ""),
      "added_by": currentTrack.blocks[5].elements[0].text
    };
    return new Response(JSON.stringify(nowPlaying), {
      headers: {
        "content-type": "application/json; charset=UTF-8",
      },
    });
  } catch (error) {
    // If something goes wrong in the above block, let's log the error
    // and return a generic error to the user.
    console.log(error);
    return new Response(null, {
      status: 500,
      statusText: "Error fetching the jukebox data. Please try again.",
    });
  }
}

console.log("Listening on http://localhost:8080");
await listenAndServe(":8080", handleRequest);
