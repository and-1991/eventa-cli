import chalk from "chalk";
import fg from "fast-glob";
import { Project } from "ts-morph";
import fs from "fs/promises";

import {
  loadConfig,
  saveConfig
} from "../utils/config";

import { detectParser } from "../utils/parsers/router";
import { parseVue } from "../utils/parsers/vue";
import { parseSvelte } from "../utils/parsers/svelte";
import { parseAstro } from "../utils/parsers/astro";

import { scanTrack } from "../utils/scanners/track";
import { scanFunctionWrappers } from "../utils/scanners/function-wrappers";
import { scanComponentWrappers } from "../utils/scanners/component-wrappers";

export async function sync() {
  const config = await loadConfig();

  if (!config) {
    console.log(
      chalk.red("Run 'eventra init'")
    );
    return;
  }

  console.log(
    chalk.blue("Scanning project...")
  );

  const project = new Project();
  const events = new Set<string>();

  const files = await fg(
    config.sync.include,
    {
      ignore: config.sync.exclude
    }
  );

  const functionWrappers =
    (config.functionWrappers ?? []).map(
      (w) => ({
        name: w.name,
        path: w.event
          ? `0.${w.event}`
          : "0"
      })
    );
  const componentWrappers =
    config.wrappers ?? [];

  for (const file of files) {
    const parser =
      detectParser(file);

    let content =
      await fs.readFile(
        file,
        "utf-8"
      );

    if (parser === "vue")
      content = parseVue(content);

    if (parser === "svelte")
      content = parseSvelte(content);

    if (parser === "astro")
      content = parseAstro(content);

    const virtualFile =
      parser === "ts"
        ? file
        : file + ".tsx";

    const source =
      project.createSourceFile(
        virtualFile,
        content,
        { overwrite: true }
      );

    scanTrack(source).forEach(
      (e) => events.add(e)
    );


    scanFunctionWrappers(
      source,
      functionWrappers
    ).forEach((e) =>
      events.add(e)
    );

    scanComponentWrappers(
      source,
      componentWrappers
    ).forEach((e) =>
      events.add(e)
    );
  }

  const list =
    [...events].sort();

  config.events = list;

  await saveConfig(config);

  console.log(
    chalk.green(
      `Found ${list.length} events`
    )
  );
}
