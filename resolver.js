import {monitorHealthUpstream} from "./utils/tests.js";

function main() {

    setInterval(function(){
        var currentDate = new Date(); // initiate current data
        if (currentDate.getHours() === 15) { // run every day at 15:00
            console.log("---------------------")
            console.log("BOOTING UP HEALTH CHECK - RESOLVER")
            console.log("---------------------")

            // CHECK FOR DUPLICATES
            // todo: https://www.phind.com/search?cache=yxa4xegiuml3tvo0ljz3sngl

            // 1. -- CHECK STATUS
            // IF UNKWOWN --> run fully

            // IF HEALTHY --> check PURL in column RESOLVE_TO

            // IF UNHEALTHY (after check) --> check PURL in column RESOLVE_TO

            // IF UNKOWN

            // CHECK RECORDS
            monitorHealthUpstream();
        }})
}

main();
