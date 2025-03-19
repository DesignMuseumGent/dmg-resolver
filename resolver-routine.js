import {monitorHealthUpstream} from "./utils/tests.js";
import {prunePrivate} from "./utils/prunePrivate.js";
import {populateIIIF, produceURIs} from "./utils/produceURIs.js";

async function resolve() {
    await prunePrivate();
    await monitorHealthUpstream('UNKNOWN');
}

resolve();