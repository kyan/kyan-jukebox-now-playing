import { assertEquals, assertThrows } from "./test.deps.ts";
import FormatTrack from "../track_formatter.ts";
import { TrackSchema } from "../types.ts";

const track: TrackSchema = {
  "spotify": "https://open.spotify.com/track/uri000",
  "title": "Seasons (Waiting On You)",
  "album": "Singles",
  "artist": "Future Islands",
  "year": "1983",
  "image": "the-album-art.jpg",
  "last_played": "6 hours ago",
  "metrics": {
    "plays": 2,
    "rating": 3,
    "votes": 2,
  },
  "added_at": "3 hours ago",
  "added_by": "Duncan",
};

Deno.test("Format Message in JSON", () => {
  assertEquals(
    FormatTrack(track).to("JSON"),
    track,
  );
});

Deno.test("Format Message in SLACK format", () => {
  assertEquals(
    FormatTrack(track).to("SLACK"),
    {
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Now Playing:",
          },
        },
        {
          "type": "divider",
        },
        {
          "type": "section",
          "block_id": "section1",
          "text": {
            "type": "mrkdwn",
            "text":
              "*<https://open.spotify.com/track/uri000|Seasons (Waiting On You)>* \n Future Islands \n Singles (1983)",
          },
          "accessory": {
            "type": "image",
            "image_url": "the-album-art.jpg",
            "alt_text": "Future Islands",
          },
        },
        {
          "type": "divider",
        },
        {
          "type": "section",
          "block_id": "section2",
          "fields": [
            {
              "type": "mrkdwn",
              "text": "*Rating:* 2",
            },
            {
              "type": "mrkdwn",
              "text": "*Voted by:* 2 users",
            },
            {
              "type": "mrkdwn",
              "text": "*Played:* 2 times",
            },
            {
              "type": "mrkdwn",
              "text": "*Last Played:* 6 hours ago",
            },
          ],
        },
        {
          "type": "context",
          "elements": [
            {
              "type": "mrkdwn",
              "text": "Added by Duncan 3 hours ago",
            },
          ],
        },
      ],
    },
  );
});

Deno.test("Handle unknown format", () => {
  assertThrows(
    () => {
      FormatTrack(track).to("MADEUP");
    },
    Error,
    "Unknown format: MADEUP!",
  );
});
