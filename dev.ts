#!/usr/bin/env -S deno run -A --watch=static/,routes/

import dev from "$fresh/dev.ts";
import config from "./fresh.config.ts";

import "$std/dotenv/load.ts";
import { start_article_writer_cron } from "./utils/media_mention_article_writer_cron.ts";

const should_start_crons = Deno.env.get("START_CRONS_ON_DEV") === "true";

if (should_start_crons) {
    start_article_writer_cron();
}

await dev(import.meta.url, "./main.ts", config);
