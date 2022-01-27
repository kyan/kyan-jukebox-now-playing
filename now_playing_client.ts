import { MongoClient } from "https://deno.land/x/mongo@v0.29.1/mod.ts";
import { CurrentTrackSchema } from "./types.ts";

export class NowPlayingClient {
  url: string;
  client: MongoClient;

  constructor({ url, client }: { url: string; client: typeof MongoClient }) {
    this.url = url;
    this.client = new client();
  }

  async fetchJSON() {
    await this.client.connect(this.url);

    const db = this.client.database("jukebox-production");
    const settings = db.collection<CurrentTrackSchema>("settings");

    return await settings.findOne({ key: "slack" }, {
      noCursorTimeout: false,
    });
  }

  close() {
    this.client.close();
  }
}
