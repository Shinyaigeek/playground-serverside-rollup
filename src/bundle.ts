import virtual from "@rollup/plugin-virtual";
import { OutputAsset, OutputChunk, rollup } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import { nodeResolve } from '@rollup/plugin-node-resolve';
import fs from "fs"
import path from "path"

function isChunk(
  chunkOrAsset: OutputAsset | OutputChunk
): chunkOrAsset is OutputChunk {
  // @ts-ignore
  return typeof chunkOrAsset.code !== "undefined";
}

export const bundle: (code: string) => Promise<string> = async function (code) {
  fs.writeFileSync(path.join(__dirname, "./entrypoint.ts"), code);
  const bundled = await rollup({
    plugins: [
    //   virtual({
    //     "entrypoint.ts": code,
    //   }),
      esbuild(),
      nodeResolve({
        moduleDirectories: [
          "node_modules",
        ],
        extensions: [".ts"],
      }),
    ],
    input: "src/entrypoint.ts",
  });

  const { output } = await bundled.generate({
    format: "es",
    sourcemap: true,
  });

  return output
    .map((chunk) => {
      if (isChunk(chunk)) {
        return chunk.code;
      } else {
        return `import "${chunk.fileName}"`;
      }
    })
    .join("\n");
};
