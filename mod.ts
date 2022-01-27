import { serve } from "https://deno.land/std@0.122.0/http/mod.ts";
import { Status } from "https://deno.land/std@0.122.0/http/http_status.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.29.1/mod.ts";
import { NowPlayingClient } from "./now_playing_client.ts";
import FormatTrack from "./track_formatter.ts";

async function handleRequest(request: Request) {
  const mongoUrl = Deno.env.get("MONGODB_URL");

  if (!mongoUrl) {
    return new Response(null, {
      status: Status.UnprocessableEntity,
      statusText: "Environment variable `MONGODB_URL` not set.",
    });
  }

  const nowPlayingClient = new NowPlayingClient({
    url: mongoUrl,
    client: MongoClient,
  });

  try {
    const data = await nowPlayingClient.fetchJSON();
    const track = data?.value?.currentTrack;
    if (!track) throw new Error("There appears to be no track data!");

    // The driver does not handle re-connecting which is why we
    // create a new connection every time and then close it. There are
    // not many users of this application.
    nowPlayingClient.close();

    const format = request.method == "POST" ? "SLACK" : "JSON";
    const payload = FormatTrack(track).to(format);

    return new Response(JSON.stringify(payload), {
      headers: {
        "content-type": "application/json; charset=UTF-8",
      },
    });
  } catch (error) {
    // If something goes wrong in the above block, let's log the error
    // and return a generic error to the user.
    console.log(error);
    return new Response(null, {
      status: Status.InternalServerError,
      statusText: "Error fetching the jukebox data. Please try again.",
    });
  }
}

console.log("Listening on http://localhost:8080");
serve(handleRequest, { port: 8080 });
