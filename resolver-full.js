import {monitorHealthUpstream} from "./utils/tests.js";
import {prunePrivate} from "./utils/prunePrivate.js";
import {populateIIIF, produceURIs} from "./utils/produceURIs.js";

function resolve() {
    populateIIIF();
    produceURIs();
    prunePrivate();
    monitorHealthUpstream('ALL')
}

resolve();