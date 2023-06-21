import { describe, expect, test } from "@jest/globals";
import { Archive, Uint8ArraySource } from "../src";
import * as fs from "fs/promises";
import * as path from "path";

async function fromFile(name: string): Promise<Archive> {
  return Archive.from(
    new Uint8ArraySource(new Uint8Array(await fs.readFile(name))),
  );
}

function toBytes(str: string): Uint8Array {
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i);
  }
  return bytes;
}

const dataDir = path.join(__dirname, "data");
const helloWorld = toBytes("Hello World!");
const cafebabe = new Uint8Array([0xca, 0xfe, 0xba, 0xbe]);

describe("Archive", () => {
  test("small", async () => {
    const archive = await fromFile(path.join(dataDir, "small.zip"));

    expect(archive.get("hello.txt")).resolves.toEqual(helloWorld);
    expect(archive.get("nested/drink.bin")).resolves.toEqual(cafebabe);
  });

  test("zip64", async () => {
    const size = 0x10000;

    const names = new Set<string>();
    for (let i = 0; i < size; i++) {
      names.add(`drink-${i.toString(16).padStart(4, "0")}.txt`);
    }

    const archive = await fromFile(path.join(dataDir, "zip64.zip"));

    expect(archive.size).toBe(size);
    expect(new Set(archive)).toEqual(names);
    expect(archive.get("drink-0000.txt")).resolves.toEqual(cafebabe);
    expect(archive.get("drink-ffff.txt")).resolves.toEqual(cafebabe);
  });
});
