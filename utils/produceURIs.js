import {connectorObjects, writeURI} from "../client/client.js";

export async function produceURIs(){
    let stream = await connectorObjects()
    console.log(stream.length)

    for (let i=0; i < stream.length; i++) {

        // fetch object number
        const reference = stream[i]["objectNumber"]

        // construct URI
        const URI = `/id/object/${reference}`
        //console.log(URI)

        // publish URI
        await writeURI(reference, URI);
        console.log(`written URI: ${URI}`)
    }

 }