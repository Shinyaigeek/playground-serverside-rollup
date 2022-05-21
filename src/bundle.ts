import virtual from "@rollup/plugin-virtual"
import { OutputAsset, OutputChunk, rollup } from "rollup"

function isChunk(chunkOrAsset: OutputAsset | OutputChunk): chunkOrAsset is OutputChunk {
    // @ts-ignore
    return typeof chunkOrAsset.code !== "undefined"
}

export const bundle: (code: string) => Promise<string> = async function(code) {
    const bundled = await rollup({
        plugins: [
            virtual({
                "entrypoint.ts": code,
            })
        ],
        input: "entrypoint.ts",
    });

    const { output } = await bundled.generate({
        format: "es",
        sourcemap: true,
    });

    return output.map(chunk => {
        if (isChunk(chunk)) {
            return chunk.code;
        }else{
            return `import "${chunk.fileName}"`;
        }
    }).join("\n");
}