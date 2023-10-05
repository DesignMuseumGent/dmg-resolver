import {connectorObjects, writeIIIFSTATUS, writePURI, writeRESOLVEROUTE, writeSTATUS} from "../client/client.js";
import * as dotenv from 'dotenv'

// init dotenv
dotenv.config()

const baseURI = process.env._baseURI

function sleep(ms){
    return new Promise(resolve=>setTimeout(resolve, ms))
}

export async function monitorHealthUpstream() {
    // this function checks the health of the published data and defines rerouting if necessary.

    let _stream = await connectorObjects()
    let _total = _stream.length
    let _count = 0;
    for (let i=0; i < _stream.length; i++) {

        let statusManifest;
        let statusLDES;

        // define PID and write to DB if not yet in there.
        const PURI = baseURI + `id/object/${_stream[i]["objectNumber"]}`
        console.log("----------")
        console.log(`${i}/${_total}`)
        console.log(`checking: ${PURI}`)


        // 1. check LDES - (see if it aligns with PID)
        statusLDES = checkLDES(_stream[i]["objectNumber"], _stream[i]["LDES_raw"])

        // SWITCH A
        // 2. if this first check passes.
        if(statusLDES){
            // 3A. check status manifest (response request)
            // SWITCH B
            statusManifest = checkManifest(_stream[i]["iiif_manifest"], _stream[i]["objectNumber"])
            await sleep(1000);
            writeRESOLVEROUTE(_stream[i]["objectNumber"], PURI)
            console.log("STATUS: HEALTHY")
        }

        // 3B. if this first check does not pass:
        else {
            // write: STATUS = UNHEALTHY (needs follow-up)
            let _ROUTE = baseURI+"id/object/UNHEALTHY"
            writeSTATUS(_stream[i]["objectNumber"], "UNHEALTHY")
            writeRESOLVEROUTE(_stream[i]["objectNumber"], _ROUTE)
            console.log("STATUS: UNHEALTHY")
        }

        // 2. write PURI to DB
        writePURI(_stream[i]["objectNumber"], PURI)

        // 3. write route to resolve to to DB

        await sleep(3000);

    }
}

function defineStatus(RES_MANIFEST, RES_LDES){

}

function checkLDES(_on, LDES) {
    // function that checks if the content alligns with the PID
    // input: objectnumber (derived from PID)

    let _STATUS;

    const _onLDES = extractObjectNumberLDES(LDES)
    if (_onLDES === _on) {
        console.log("content in LDES matches with PID")
        _STATUS = true;
    } else {
        console.log("WARNING: CONTENT DOES NOT MATCH.")
        _STATUS = false
    }
    return _STATUS
}

function extractObjectNumberLDES(LDES) {
    const LDES_ON = LDES['object']['http://www.w3.org/ns/adms#identifier'][1]['skos:notation']['@value']
    console.log(`objectnumber in LDES: ${LDES_ON}`)
    return LDES_ON
}

export async function checkManifest(manifest, _ON){
    let _STATUS;
    // fetch data upstream (db)
    fetch(manifest)
        .then((res) => {
            //console.log(res.status)
            console.log(`IIIF Manifest Response: ${res.status}`)
            _STATUS = checkResponse(res.status, _ON)

        })
        .catch((err) => {
            console.log(err)
        })
    return _STATUS;
}

function checkResponse(RES, _ON) {
    // check response and write to DB.
    // column: iiif_manifest_RESPONSE
    let STAT;
    switch(RES) {
        case RES=200:
            // OK
            writeIIIFSTATUS(_ON, RES)
            writeSTATUS(_ON, "HEALTHY")
            STAT = true;

        case RES=403:
            // FORBIDDEN (restricted access)
            writeIIIFSTATUS(_ON, RES)
            writeSTATUS(_ON, "HEALTHY")
            STAT = true;

        case RES=404:
            // NOT FOUND
            writeIIIFSTATUS(_ON, RES)
            writeSTATUS(_ON, "UNHEALTHY")
            STAT = false;

        case RES=503:
            // SERVICE UNAVAILABLE
            writeIIIFSTATUS(_ON, RES)
            STAT = false;
    }
    return STAT;
}

