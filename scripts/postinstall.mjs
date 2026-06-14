import { execSync } from "child_process";

// npm install --prefix client-2 re-triggers root postinstall — run once only
if (process.env.ZOOPHII_POSTINSTALL) {
  process.exit(0);
}

const env = { ...process.env, ZOOPHII_POSTINSTALL: "1" };

execSync("npm install --prefix client-2", { stdio: "inherit", env });

// Render build phase often uses only `npm install` — build the SPA here
if (process.env.RENDER === "true") {
  console.log("Render: building client-2 frontend...");
  execSync("npm run client2:build", { stdio: "inherit", env });
}
