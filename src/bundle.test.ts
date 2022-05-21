import { expect, test } from "vitest";

import { bundle } from "./bundle";

const code = `
import { h } from "./mods/hoge";
console.log("hoge", h);
console.log("my-code");
`;

// 使うフェーズになったらまた実装しなおす
test(
  "bundle",
  async () => {
    const output = await bundle(code);
    console.log(output)
    expect(output).toEqual("edge.main.js");
  },
);
