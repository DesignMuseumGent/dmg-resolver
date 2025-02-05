import {connectorObjects, connectorPrivateStream, writeIIIFSTATUS, writeStatusPrivate} from "../client/client.js";

export async function prunePrivate() {
    let streamPrivate = await connectorPrivateStream();
    let streamPublic = await connectorObjects();

    let totalPrivate = streamPrivate.length;
    let totalPublic = streamPublic.length;

    for(let i = 0; i < streamPublic.length; i++) {
        //console.log(streamPublic[i]["objectNumber"])
        // check if this number is also in the private stream
        let objectNumber = streamPublic[i]["objectNumber"]
        if (objectNumber in streamPrivate){
            console.log("duplicate")
            writeStatusPrivate(objectNumber, true)
        }
        // if not continue
        // if yes set duplicate to TRUE.
    }


    //console.log(streamPublic)

    console.log(totalPrivate)
    console.log(totalPublic)
}


