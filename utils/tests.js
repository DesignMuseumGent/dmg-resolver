import {connectorObjects, writeIIIFSTATUS, writePURI} from "../client/client.js";
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
    for (let i=0; i < _stream.length; i++) {

        // define PID and write to DB if not yet in there.
        const PURI = baseURI + `id/object/${_stream[i]["objectNumber"]}`
        console.log("----------")
        console.log(`checking: ${PURI}`)

        // 1. check status manifest
        await checkManifest(_stream[i]["iiif_manifest"], _stream[i]["objectNumber"])
        await sleep(3000);

        // 2. write PURI to DB
        writePURI(_stream[i]["objectNumber"], PURI)

        // 3. write route to resolve to to DB

    }
}

export async function checkManifest(manifest, _ON){
    let status;
    // fetch data upstream (db)
    fetch(manifest)
        .then((res) => {
            //console.log(res.status)
            console.log(`IIIF Manifest Response: ${res.status}`)
            checkResponse(res.status, _ON)
        })
        .catch((err) => {
            console.log(err)
        })
    return status;
}

function checkResponse(RES, _ON) {
    // check response and write to DB.
    // column: iiif_manifest_RESPONSE
    switch(RES){
        case RES=200:
            // OK
            writeIIIFSTATUS(_ON, RES)
            return true;

        case RES=403:
            // FORBIDDEN (restricted access)
            writeIIIFSTATUS(_ON, RES)
            return true;

        case RES=404:
            // NOT FOUND
            writeIIIFSTATUS(_ON, RES)
            return false;

        case RES=503:
            // SERVICE UNAVAILABLE
            writeIIIFSTATUS(_ON, RES)
            return false;
    }
}

