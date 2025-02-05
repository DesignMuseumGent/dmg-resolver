import { monitorHealthUpstream } from "./utils/tests.js";
import cron from "node-cron";
import {populateIIIF, produceURIs} from "./utils/produceURIs.js";
import {prunePrivate} from "./utils/prunePrivate.js";

function main() {
  console.log("---------------------");
  console.log("BOOTING UP HEALTH CHECK - RESOLVER");
  console.log("---------------------");

  // populate database if necessary
  populateIIIF()
  produceURIs();

  // CHECK FOR DUPLICATES
  // todo: https://www.phind.com/search?cache=yxa4xegiuml3tvo0ljz3sngl

  // CHECK RECORDS

  // scan only UNKNOWN objects (daily at 00:00)
  cron.schedule("0 00 * * *", () => {
    monitorHealthUpstream("UNKNOWN");
    // prune objects that have been published from the other list.
    prunePrivate()
    console.log("ONLY CHECKING OBJECTS WITH STATUS: UNKNOWN");
  });

  // scan only UNHEALTHY objects (daily at 01:00)
  cron.schedule("1 00 * * 7", () => {
    monitorHealthUpstream("UNHEALTHY");
    console.log("ONLY CHECKING OBJECTS WITH STATUS: UNHEALTHY");
  });

  // full scan (only once per week - 02:00 on friday)
  cron.schedule("0 0 * * 6", () => {
    monitorHealthUpstream("ALL");
    console.log("SCANNING ALL OBJECTS - FULL CHECK");
  });
}

// run main
main();


