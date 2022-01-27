export interface TrackSchema {
  spotify: string;
  title: string;
  album: string;
  artist: string;
  year: string;
  image: string;
  last_played: string | null;
  metrics: {
    plays: number;
    rating: number;
    votes: number;
  };
  added_at: string;
  added_by: string;
}

export interface CurrentTrackSchema {
  key: string;
  value: {
    currentTrack: TrackSchema;
  };
}

// Slack interfaces from:
// https://github.com/slackapi/node-slack-sdk/blob/main/packages/types/src/index.ts

export interface MrkdwnElement {
  type: "mrkdwn";
  text: string;
  verbatim?: boolean;
}

interface ImageElement {
  type: "image";
  image_url: string;
  alt_text: string;
}

interface Action {
  type: string;
  action_id?: string;
}

interface Block {
  type: string;
  block_id?: string;
}

interface SectionBlock extends Block {
  type: "section";
  text?: MrkdwnElement;
  accessory?: ImageElement;
  fields?: MrkdwnElement[];
}

interface ContextBlock extends Block {
  type: "context";
  elements: MrkdwnElement[];
}

export interface SlackSchema {
  blocks: (SectionBlock | ContextBlock | Action)[];
}
