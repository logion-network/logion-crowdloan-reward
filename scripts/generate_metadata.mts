import { generatePSP34TokenItemId } from "@logion/client";
import { mkdir, writeFile, readFile } from "fs/promises";
import { exit } from "process";

const TOTAL = 250;
const NONCE = "";
const COLLECTION_LOC_ID = "17825491029441914880487572037461113128";
const CERTIFICATE_HOST = "dev-certificate.logion.network";

async function main() {
    const inMetadataFolder = "metadata-input";
    const outMetadataFolder = "metadata";

    await mkdir(outMetadataFolder, { recursive: true });

    for (let i = 0; i < TOTAL; ++i) {
        const inMetadataFile = `${ inMetadataFolder }/template.json`;
        const metadataBuffer = await readFile(inMetadataFile);
        const metadata = JSON.parse(metadataBuffer.toString());

        metadata.attributes.push({
            trait_type: "LOC ID",
            value: COLLECTION_LOC_ID,
        });
        metadata.attributes.push({
            trait_type: "Item ID",
            value: generatePSP34TokenItemId(NONCE, { type: "U64", value: i.toString() }).toHex(),
        });
        metadata.attributes.push({
            trait_type: "Certificate URL",
            value: certificateUrl(i),
        });
        metadata.name = `${ metadata.name }#${ i.toString() }`
        metadata.external_url = certificateUrl(i);

        let outMetadataFile = `${ outMetadataFolder }/${ i }.json`;
        console.log(`Creating file ${ outMetadataFile }`);
        await writeFile(
            outMetadataFile,
            JSON.stringify(metadata, undefined, 2)
        );
    }
}

function certificateUrl(tokenId: number): string {
    return `https://${ CERTIFICATE_HOST }/public/certificate/${ COLLECTION_LOC_ID }/${ generatePSP34TokenItemId(NONCE, {
        type: "U64",
        value: tokenId.toString()
    }).toHex() }`;
}

main().catch((error) => {
    console.error(error);
    exit(1);
});
