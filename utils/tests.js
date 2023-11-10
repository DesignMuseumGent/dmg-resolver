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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function monitorHealthUpstream(STATUS) {
  // this function checks the health of the published data and defines rerouting if necessary.

  let _stream = await connectorObjects();
  let _total = _stream.length;
  let _count = 0;
  for (let i = 0; i < _stream.length; i++) {
    let statusManifest; // health status of manifest (based on http response)
    let statusLDES; // health status of LDES (based on object id)
    let mainStatus; // overal health status
    let check = false;

    switch (STATUS) {
      case "UNKNOWN":
        // only if status is UNKNOWN check this object
        if (_stream[i]["STATUS"] === "UNKNOWN") {
          check = true;
        }
        break;
      case "UNEALTHY":
        // only if unhealthy check this object
        if (_stream[i]["STATUS"] === "UNHEALTHY") {
          // add staging where it first checks if check has happened.
          // if yes, then check if the resolve_to is functioning.
          // if yes assign STATUS healthy
          // // add staging where it first checks if check has happened.
          // if yes, then check if the resolve_to is functioning.
          // if yes assign STATUS healthy
          // if not assign STATUS unhealthy.
          // if not assign STATUS unhealthy
          check = true;
        }
        break;
      case "ALL":
        check = true;
        break;
    }

    if (check) {
      // define PID and write to DB if not yet in there.
      const PURI = baseURI + `id/object/${_stream[i]["objectNumber"]}`;
      console.log("----------");
      console.log(`${i}/${_total}`);
      console.log(`checking: ${PURI}`);

      // 1. check LDES - (see if it aligns with PID)
      statusLDES = checkLDES(
        _stream[i]["objectNumber"],
        _stream[i]["LDES_raw"],
      );
      await sleep(1000);

      // SWITCH A
      // 2. if this first check passes.
      if (statusLDES == true) {
        // 3A. check status manifest (response request)
        checkManifest(
          _stream[i]["iiif_manifest"],
          _stream[i]["objectNumber"],
          PURI,
        );
        await sleep(1000);
      }

      // 3B. if this first check does not pass:
      else {
        // write: STATUS = UNHEALTHY (needs follow-up)
        let _ROUTE = baseURI + "id/object/UNHEALTHY";
        await writeSTATUS(_stream[i]["objectNumber"], "UNHEALTHY");
        await writeRESOLVEROUTE(_stream[i]["objectNumber"], _ROUTE);
        console.log(`RESOLVE TO: ${_ROUTE}`);
        console.log("STATUS: UNHEALTHY");
      }

      // 2. write PURI to DB
      await writePURI(_stream[i]["objectNumber"], PURI);

      // 3. write route to resolve to to DB
      await sleep(3000);
    } else {
    }
  }
}

function checkLDES(_on, LDES) {
  // function that checks if the content alligns with the PID
  // input: objectnumber (derived from PID)

  let _STATUS;

  const _onLDES = extractObjectNumberLDES(LDES);
  if (_onLDES === _on) {
    console.log("content in LDES matches with PID");
    _STATUS = true;
  } else {
    console.log("WARNING: CONTENT DOES NOT MATCH.");
    _STATUS = false;
  }
  return _STATUS;
}

function extractObjectNumberLDES(LDES) {
  const LDES_ON =
    LDES["object"]["http://www.w3.org/ns/adms#identifier"][1]["skos:notation"][
      "@value"
    ];
  console.log(`objectnumber in LDES: ${LDES_ON}`);
  return LDES_ON;
}

export async function checkManifest(manifest, _ON, pURI) {
  let _STATUS;
  // fetch data upstream (db)
  fetch(manifest)
    .then((res) => {
      //console.log(res.status)
      console.log(`IIIF Manifest Response: ${res.status}`);
      _STATUS = checkResponse(res.status, _ON, pURI);
    })
    .catch((err) => {
      console.log(err);
    });
  return _STATUS;
}

function checkResponse(RES, _ON, PURI) {
  // check response and write to DB.
  // column: iiif_manifest_RESPONSE

  switch (RES) {
    case 200:
      // OK
      writeIIIFSTATUS(_ON, RES);
      writeRESOLVEROUTE(_ON, PURI);
      writeSTATUS(_ON, "HEALTHY");
      console.log(`RESOLVE_TO: ${PURI}`);
      console.log("STATUS: HEALTHY");
      break;

    case 403:
      // FORBIDDEN (restricted access)
      writeIIIFSTATUS(_ON, RES);
      writeRESOLVEROUTE(_ON, PURI);
      writeSTATUS(_ON, "HEALTHY");
      console.log(`RESOLVE_TO: ${PURI}`);
      console.log("STATUS: HEALTHY");
      break;

    case 404:
      // NOT FOUND
      writeIIIFSTATUS(_ON, RES);
      writeRESOLVEROUTE(_ON, baseURI + "id/object/UNHEALTHY");
      writeSTATUS(_ON, "UNHEALTHY");
      console.log(`RESOLVE_TO: ${baseURI + "id/object/UNHEALTHY"}`);
      console.log("STATUS: UNHEALTHY");
      break;

    case 503:
      // SERVICE UNAVAILABLE
      writeIIIFSTATUS(_ON, RES);
      writeRESOLVEROUTE(_ON, baseURI + "id/object/UNHEALTHY");
      writeSTATUS(_ON, "UNHEALTHY");
      console.log(`RESOLVE_TO: ${baseURI + "id/object/UNHEALTHY"}`);
      console.log("STATUS: UNHEALTHY");
      break;
  }
}
