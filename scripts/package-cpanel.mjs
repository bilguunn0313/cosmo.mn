import { execSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const webDir = path.join(root, "apps", "web");
const outDir = path.join(root, "dist-cpanel");
const apiOut = path.join(outDir, "cosmo-api");
const webOut = path.join(outDir, "cosmo-web");
const webEnvFile = ".env.production.local";
const requiredWebVariables = ["API_URL", "NEXT_PUBLIC_API_URL", "SITE_URL"];

function fail(message) {
  console.error(`\n✗ ${message}`);
  process.exit(1);
}

function run(command, cwd = root, env = {}) {
  console.log(`\n> ${command}`);
  execSync(command, { cwd, stdio: "inherit", env: { ...process.env, ...env } });
}

function writeJson(file, value) {
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function readEnvFile(file) {
  const values = {};

  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);

    if (match) {
      values[match[1]] = match[2].trim().replace(/^"(.*)"$/, "$1");
    }
  }

  return values;
}

function checkWebEnv() {
  const file = path.join(webDir, webEnvFile);

  if (!existsSync(file)) {
    fail(
      `apps/web/${webEnvFile} файл алга. ${requiredWebVariables.join(", ")} утгуудыг бичээд дахин ажиллуулна уу.`,
    );
  }

  const values = readEnvFile(file);
  const missing = requiredWebVariables.filter((name) => !values[name]);

  if (missing.length > 0) {
    fail(`apps/web/${webEnvFile} файлд дутуу: ${missing.join(", ")}`);
  }
}

function build() {
  run("npm run build:api", root, {
    DATABASE_URL:
      process.env.DATABASE_URL ?? "mysql://build:build@localhost:3306/build",
  });
  run("npm run build:web");
}

function packShared() {
  const output = execSync(`npm pack --json --pack-destination "${apiOut}"`, {
    cwd: path.join(root, "packages", "shared"),
  });
  return JSON.parse(output.toString())[0].filename;
}

function packageApi() {
  const apiPackage = JSON.parse(
    readFileSync(path.join(root, "apps", "api", "package.json"), "utf8"),
  );

  cpSync(path.join(root, "apps", "api", "dist"), path.join(apiOut, "dist"), {
    recursive: true,
  });
  const sharedTarball = packShared();

  writeJson(path.join(apiOut, "package.json"), {
    name: "cosmo-api",
    private: true,
    main: "dist/main.js",
    scripts: { start: "node dist/main.js" },
    engines: { node: ">=20.19" },
    dependencies: {
      ...apiPackage.dependencies,
      "@cosmo/shared": `file:./${sharedTarball}`,
    },
  });

  run("npm install --package-lock-only --ignore-scripts", apiOut);
}

function removeEnvFilesExceptProduction(dir) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".env") && name !== webEnvFile) {
      rmSync(path.join(dir, name));
    }
  }
}

function packageWeb() {
  const standaloneOut = path.join(webOut, "standalone");
  const webAppOut = path.join(standaloneOut, "apps", "web");

  cpSync(path.join(webDir, ".next", "standalone"), standaloneOut, {
    recursive: true,
    dereference: true,
  });
  cpSync(
    path.join(webDir, ".next", "static"),
    path.join(webAppOut, ".next", "static"),
    { recursive: true },
  );
  cpSync(path.join(webDir, "public"), path.join(webAppOut, "public"), {
    recursive: true,
  });
  cpSync(path.join(webDir, webEnvFile), path.join(webAppOut, webEnvFile));
  removeEnvFilesExceptProduction(webAppOut);

  writeFileSync(
    path.join(webOut, "app.js"),
    'require("./standalone/apps/web/server.js");\n',
  );
  writeJson(path.join(webOut, "package.json"), {
    name: "cosmo-web",
    private: true,
    main: "app.js",
  });
}

function zipCommand(zipFile, entries) {
  const list = entries.map((entry) => `"${entry}"`).join(" ");

  if (process.platform === "win32") {
    const tar = path.join(process.env.SystemRoot, "System32", "tar.exe");
    return `"${tar}" -a -c -f "${zipFile}" ${list}`;
  }

  if (process.platform === "darwin") {
    return `tar -a -c -f "${zipFile}" ${list}`;
  }

  return `zip -r -q "${zipFile}" ${list}`;
}

function zip(folder) {
  const zipFile = path.join(outDir, `${path.basename(folder)}.zip`);
  run(zipCommand(zipFile, readdirSync(folder)), folder);
  return zipFile;
}

checkWebEnv();
build();

rmSync(outDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 500 });
mkdirSync(apiOut, { recursive: true });
mkdirSync(webOut, { recursive: true });

packageApi();
packageWeb();

const apiZip = zip(apiOut);
const webZip = zip(webOut);

console.log("\n✓ Бэлэн:");
console.log(`  ${path.relative(root, apiZip)}`);
console.log(`  ${path.relative(root, webZip)}`);
