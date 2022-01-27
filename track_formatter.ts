import { MrkdwnElement, SlackSchema, TrackSchema } from "./types.ts";

function simplePluralize(count: number, noun: string, suffix = "s"): string {
  return `${count} ${noun}${count !== 1 ? suffix : ""}`;
}

function lastPlayed(lastPlayed: string): MrkdwnElement {
  return {
    type: "mrkdwn",
    text: `*Last Played:* ${lastPlayed}`,
  };
}

function formatSlack(track: TrackSchema): SlackSchema {
  const metrics: MrkdwnElement[] = [
    {
      type: "mrkdwn",
      text: `*Rating:* ${track?.metrics.votes}`,
    },
    {
      type: "mrkdwn",
      text: `*Voted by:* ${simplePluralize(track?.metrics.votes || 0, "user")}`,
    },
    {
      type: "mrkdwn",
      text: `*Played:* ${simplePluralize(track?.metrics.plays || 0, "time")}`,
    },
  ];
  if (track?.last_played) metrics.push(lastPlayed(track.last_played));

  return {
    blocks: [
      { type: "section", text: { type: "mrkdwn", text: "Now Playing:" } },
      { type: "divider" },
      {
        type: "section",
        block_id: "section1",
        text: {
          type: "mrkdwn",
          text: `*<${track?.spotify}|${track?.title}>* \n ${track
            ?.artist} \n ${track?.album} (${track?.year})`,
        },
        accessory: {
          type: "image",
          image_url: track?.image,
          alt_text: track?.artist,
        },
      },
      { type: "divider" },
      {
        type: "section",
        block_id: "section2",
        fields: metrics,
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Added by ${track?.added_by} ${track?.added_at}`,
          },
        ],
      },
    ],
  };
}

const FormatTrack = (track: TrackSchema) => {
  return {
    to: (format: string) => {
      if (format == "JSON") return track;
      if (format == "SLACK") return formatSlack(track);

      throw new Error(`Unknown format: ${format}!`);
    },
  };
};

export default FormatTrack;
