import { createApp } from "./app.js";
import { env } from "./lib/env.js";

const app = createApp();

app.listen(env.port, () => {
  console.log(`ExcelWeb API listening on http://localhost:${env.port} (${env.nodeEnv})`);
});
