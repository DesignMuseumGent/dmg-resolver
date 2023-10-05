import {monitorHealthUpstream} from "./utils/tests.js";

function main() {
    console.log("---------------------")
    console.log("BOOTING UP HEALTH CHECK - RESOLVER")
    console.log("---------------------")

    // CHECK FOR DUBPLICATES
    // todo:

    // CHECK RECORDS
    monitorHealthUpstream();
}

main();
