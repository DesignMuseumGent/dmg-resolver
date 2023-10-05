import {supabase} from "./supabaseClient.js";
export async function connectorObjects() {
    const {data, error} = await supabase
        .from('dmg_objects_LDES')
        .select('objectNumber, RESOLVES_TO, PURI, iiif_manifest')
    return data;
}

export async function writeIIIFSTATUS(_on, RES) {
    const {data, error} = await supabase
        .from('dmg_objects_LDES')
        .update({'iiif_manifest_RESPONSE': RES})
        .eq("objectNumber", _on)
}

export async function writePURI(_on, PURI) {
    const{data, error} = await supabase
        .from('dmg_objects_LDES')
        .update({'PURI': PURI})
        .eq("objectNumber", _on)
}
