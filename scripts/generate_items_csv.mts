import { createWriteStream } from "fs";
import { exit } from "process";
import * as csv from "fast-csv";
import { readFile } from "fs/promises";
import { generatePSP34TokenItemId } from "@logion/client";

const TOTAL = 233 + 6;
const NONCE = "";
const CONTRACT = "YjZbHDyYKMGWpYd3Hs7FrKput7dCznsEeYVipduLBTrRek3";

async function main() {
  const metadataFolder = "metadata";

  const csvStream = csv.format({ headers: true });
  const fileStream = createWriteStream("items.csv");
  csvStream.pipe(fileStream);

  for(let i = 0; i < TOTAL; ++i) {
    console.log(`Handling token ${i}`);
    const metadataFile = `${metadataFolder}/${i}.json`;

    const metadataBuffer = await readFile(metadataFile);
    const metadata = JSON.parse(metadataBuffer.toString());
    const itemId = generatePSP34TokenItemId(NONCE, { type: "U64", value: i.toString() }).toHex();

    csvStream.write({
      ["ID"]: itemId,
      ["DESCRIPTION"]: metadata.description,
      ["TOKEN TYPE"]: "astar_psp34",
      ["TOKEN ID"]: `{"contract":"${CONTRACT}","id":{"U64":${i}}}`,
      ["TOKEN ISSUANCE"]: 1,
      ["TERMS_AND_CONDITIONS TYPE"]: "logion_classification",
      ["TERMS_AND_CONDITIONS PARAMETERS"]: `{"transferredRights": ["PER-PRIV", "WW", "NOTIME"]}`,
    });
  }

  csvStream.end();
}

main().catch((error) => {
  console.error(error);
  exit(1);
});
