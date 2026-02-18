const { spawn } = require("node:child_process");

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
let shuttingDown = false;

function spawnProcess(name, command, args) {
  const child = spawn(command, args, {
    stdio: "inherit",
    env: process.env,
  });

  child.on("exit", (code, signal) => {
    if (shuttingDown) {
      return;
    }

    const reason = signal ? `signal ${signal}` : `code ${code}`;
    console.error(`[${name}] exited with ${reason}`);
    shutdown(code || 1);
  });

  return child;
}

const processes = [
  spawnProcess("server", "node", ["server/index.cjs"]),
  spawnProcess("client", npmCmd, ["--prefix", "client", "run", "dev"]),
];

function shutdown(exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const child of processes) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }

  setTimeout(() => process.exit(exitCode), 200);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
