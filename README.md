# Kyan Jukebox Now Playing data

This app provides now playing data in JSON for our Office Jukebox.

- POST - This will return data that is in the format of a Slack custom message
- GET - simple JSON

## Running locally

`MONGODB_URL="<path-to-mongo>" deno run --allow-all --no-check --watch mod.ts`

## Deploy

[![Deploy this example](https://deno.com/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://github.com/kyan/kyan-jukebox-now-playing/blob/HEAD/mod.ts&env=MONGODB_URL)

## Test

You can run the tests with `deno test`

## Code formatting

`deno fmt`
