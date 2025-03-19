import {connectorObjects, writeManifest, writeURI} from "../client/client.js";

export async function produceURIs(){
    let stream = await connectorObjects()

    if (stream) {
        console.log(stream.length)

        for (let i=0; i < stream.length; i++) {
            if (stream[i]["PID"] === null) {
                // fetch object number
                const reference = stream[i]["objectNumber"]

                // construct URI
                const URI = `/id/object/${reference}`
                console.log(`${i}/${stream.length} - /id/object/${reference}`)
                //console.log(URI)

                // publish URI
                await writeURI(reference, URI);
                console.log(`written URI: ${URI}`)
            }
        }
    }
 }

 export async function populateIIIF() {
    console.log("populating IIIF manifests")

    let stream = await connectorObjects()

     if (stream) {
         for (let i=0; i < stream.length; i++) {
             if (stream[i]["iiif_manifest"] === null) {
                 // fetch object number
                 const reference = stream[i]["objectNumber"]

                 try {
                     // construct URI
                     const MANIFEST = stream[i]["LDES_raw"]["object"]["http://www.cidoc-crm.org/cidoc-crm/P129i_is_subject_of"]["@id"]

                     // ["object"]["http://www.cidoc-crm.org/cidoc-crm/P129i_is_subject_of"]["@id"]
                     console.log(`${i}/${stream.length} - ${MANIFEST}`)

                     // publish URI
                     await writeManifest(reference, MANIFEST);
                 } catch (e) {
                     console.log(e)
                 }
                 //console.log(`written URI: ${URI}`)
             }
         }
     }


 }