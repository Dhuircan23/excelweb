import { createApp } from "./app.js";
import { env } from "./lib/env.js";

const app = createApp();

const PORT = Number(process.env.PORT) || env.port || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`ExcelWeb API listening on port ${PORT} (${env.nodeEnv})`);
});
