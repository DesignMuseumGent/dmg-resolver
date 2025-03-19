import { supabase } from "./supabaseClient.js";
export async function connectorObjects() {
  const { data, error } = await supabase
    .from("dmg_objects_LDES")
    .select(
      "*",
    );
  return data;
}

export async function connectorPrivateStream(){
  //console.log(supabase)
  const { data, error } = await supabase
    .from("dmg_private_objects_LDES")
    .select(
      "objectNumber"
    )
      .eq("duplicate", "FALSE");
  return data;
}

export async function writeStatusPrivate(_on, STATUS) {
  const { data, error } = await supabase
      .from("dmg_private_objects_LDES")
      .update({duplicate: STATUS})
      .eq("objectNumber", _on);
}

export async function writeIIIFSTATUS(_on, RES) {
  const { data, error } = await supabase
    .from("dmg_objects_LDES")
    .update({ iiif_manifest_RESPONSE: RES })
    .eq("objectNumber", _on);
}

export async function writePURI(_on, PURI) {
  const { data, error } = await supabase
    .from("dmg_objects_LDES")
    .update({ PURI: PURI })
    .eq("objectNumber", _on);
}

export async function writeSTATUS(_on, STATUS) {
  const { data, error } = await supabase
    .from("dmg_objects_LDES")
    .update({ STATUS: STATUS })
    .eq("objectNumber", _on);
}

export async function writeRESOLVEROUTE(_on, ROUTE) {
  const { data, error } = await supabase
    .from("dmg_objects_LDES")
    .update({ RESOLVES_TO: ROUTE })
    .eq("objectNumber", _on);
}

export async function writeURI(_on, PID) {
  const { data, error } = await supabase
      .from("dmg_objects_LDES")
      .update({PID: PID})
      .eq("objectNumber", _on)
}

export async function writeManifest(_on, MANIFEST){
  const {data, error} = await supabase
      .from('dmg_objects_LDES')
      .update({iiif_manifest: MANIFEST})
      .eq("objectNumber", _on);
}

