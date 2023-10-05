# RESOLVER  - DESIGN MUSEUM GENT
Node-based service to maintain a healthy upstream for the [REST-API](https://github.com/oliviervd/dmg-rest-api) of Design Museum Gent.

## WHAT IT DOES. 
* each week (on sunday) our DB is vetted for inconsistencies to ensure a healthy upstream.
* Inconsistencies include (tracing duplicates, tracing HTTP Client or Server errors, inconsistencies between PID and data (due to changes in metadata f.e.))
* a status report is generated so if necessary, our staff is aware of what changes need to be made.

## DEPENDENCIES 
* Linked Data Event Stream
* Postgres Database
* IIIF persentation API

checks the museums database and REST-API on a weekly basis and based on a switch-case assigns it a status of HEALTHY or UNHEALTHY. Based on this check a route is defined to which the API needs to resolve when the PURI is requested via the REST-API. 

This output is written away in a report and send to staff members within the museum for follow-up.   

This way we want to ensure Persistent Uniform Resource Locators (PURL) to maintain a healthy upstream, and ensure accesibility to our data.  

### output:

```
----------
0/5864
checking: https://data.designmuseumgent.be/id/object/0559
IIIF Manifest Response: 200
objectnumber in LDES: 0559
content in LDES matches with PID
STATUS: HEALTHY
----------
1/5864
checking: https://data.designmuseumgent.be/id/object/2017-0448
IIIF Manifest Response: 200
objectnumber in LDES: 2017-0448
content in LDES matches with PID
STATUS: HEALTHY
----------
```



