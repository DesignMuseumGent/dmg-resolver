import {supabase} from "./supabaseClient.js";
export async function connectorObjects() {
    const {data, error} = await supabase
        .from('dmg_objects_LDES')
        .select('objectNumber, RESOLVES_TO, PURI, iiif_manifest, LDES_raw')
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

export async function writeSTATUS(_on, STATUS) {
    const {data, error} = await supabase
        .from('dmg_objects_LDES')
        .update({'STATUS':STATUS})
        .eq("objectNumber", _on)
}

export async function writeRESOLVEROUTE(_on, ROUTE) {
    const {data, error} = await supabase
        .from('dmg_objects_LDES')
        .update({'RESOLVES_TO': ROUTE})
        .eq("objectNumber", _on)
}