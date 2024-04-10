import fs from "fs";
import path from "path";
import colors from "picocolors";
import process from "process";
import { defineMock } from "vite-plugin-mock-dev-server";

const print = (type, msg) => {
  const date = colors.dim(new Date().toLocaleTimeString());
  const tag = colors.bold("[vite:mock-file]");

  if (type === "error") {
    console.error(`${date} ${colors.red(tag)} ${msg}`);
  } else if (type === "warn") {
    console.warn(`${date} ${colors.yellow(tag)} ${msg}`);
  } else {
    console.info(`${date} ${colors.cyan(tag)} ${msg}`);
  }
};

export default defineMock([
  {
    url: "/(.*)",
    response: async (req, res, next) => {
      if (!req.url) {
        return next();
      }

      const reqUrl = new URL(req.url, "http://localhost");
      const mockPath = path.join(process.cwd(), "mock", reqUrl.pathname);
      const mockFile = path.normalize(mockPath) + ".json";

      try {
        const mockContent = await fs.promises.readFile(mockFile, {
          encoding: "utf-8",
        });
        res.end(mockContent);
        print("info", `matched file: ${mockFile}`);
      } catch (err) {
        if (err.code === "ENOENT") {
          print("warn", `unmatch file: ${mockFile}`);
          // res.writeHead(404).end();
          next();
        } else {
          print("error", err);
          next(err);
        }
      }
    },
  },
]);
