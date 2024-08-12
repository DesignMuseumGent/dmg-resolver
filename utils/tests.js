import {
  connectorObjects,
  writeIIIFSTATUS,
  writePURI,
  writeRESOLVEROUTE,
  writeSTATUS,
} from "../client/client.js";
import * as dotenv from "dotenv";

// init dotenv
dotenv.config();

const baseURI = process.env._baseURI;
const HEALTHY = "HEALTHY"
const UNHEALTHY = "UNHEALTHY"

const sleep = async (ms) => new Promise((resolve)=>setTimeout(resolve, ms))
const getLDESObjectNumber = (LDES) => LDES["object"]["http://www.w3.org/ns/adms#identifier"][1]["skos:notation"]["@value"];

export async function monitorHealthUpstream(status) {
  // this function checks the health of the published data and defines rerouting if necessary.

  let stream = await connectorObjects();
  let total = stream.length;

  for (let i = 0; i < stream.length; i++) {
    const item = stream[i]
    const {objectNumber, iiif_manifest, LDES_raw, check, STATUS} = item
    const PURI = `id/object/${objectNumber}`;

    let shouldCheck = (
        (status === "UNKNOWN" && STATUS === "UNKNOWN") ||
        (status === "UNHEALTHY" && STATUS === "UNHEALTHY" && !check) ||
        (status === "ALL" && !check)
    )

    if (!shouldCheck) continue;

    console.log(`checking: ${PURI}`)


    if (checkLDES(objectNumber, LDES_raw)) {
      await checkManifest(iiif_manifest, objectNumber, PURI)
    } else {
      await writeToDB(objectNumber, UNHEALTHY, "id/object/UNHEALTHY")
    }

    await writePURI(objectNumber, PURI);
    await sleep(3000);
  }
}

function checkLDES(objectNumber, LDES) {
  const LDES_ObjectNumber = getLDESObjectNumber(LDES);
  const status = (LDES_ObjectNumber === objectNumber) ;
  console.log(status ? "content in LDES matches with PID" : "WARNING: CONTENT DOES NOT MATCH.");
  return status
}

async function checkManifest(manifest, objectNumber, PURI) {
  try {
    const response = await fetch(manifest)
    console.log(`IIIF Manifest response: ${response.status}`)
    handleResponse(response.status, objectNumber, PURI);

  } catch (e) {
    console.log(e)
  }
}

async function handleResponse(responseStatus, objectNumber, PURI) {
  const resolverRoute = (responseStatus == 200 || responseStatus === 403) ? PURI : "id/object/UNHEALTHY"
  const status = (responseStatus === 200 || responseStatus === 403) ? HEALTHY : UNHEALTHY;
  await writeToDB(objectNumber, responseStatus, resolverRoute, status)
}

async function writeToDB(objectNumber, response, route, status) {
  await writeIIIFSTATUS(objectNumber, response);
  await writeRESOLVEROUTE(objectNumber, route);
  await writeSTATUS(objectNumber, status);
  console.log(`RESOLVE_TO: ${route}`);
  console.log(`STATUS: ${status}`);
}