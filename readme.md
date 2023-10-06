# RESOLVER  - DESIGN MUSEUM GENT
Node-based service to maintain a healthy upstream for the [REST-API](https://github.com/oliviervd/dmg-rest-api) of Design Museum Gent.

## WHAT IT DOES. 
* each week (on sunday) the museums' postgres database is vetted for inconsistencies and errors - to ensure a healthy upstream.
* inconsistencies include (enity duplicates, HTTP Client and/or Server errors, misalignment between PID and metadata (due to changes in registration (fe. changing objectnumber) f.e.))
* based on the switch cases (mentioned above), each endpoint is given a status (healthy / unhealthy)
* based on the status, the route to which the Persistent Uniform Resource Locator needs to (re)direct is defined and stored in the DB to be used when resolving. 
* a status report is generated so if necessary, our staff is aware of what changes need to be made. 

## DEPENDENCIES 
* [node-service-eventstream-api](https://github.com/StadGent/node_service_eventstream-api) (service publishing eventstreams from our data)
* Postgres Database (Supabase instance)
* IIIF persentation API
* IIIF image server

This way the museum wants to ensure Persistent Uniform Resource Locators (PURL) - to both maintain a healthy upstream and ensure accesibility to our data. 

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

## SETUP
**IN ORDER TO USE THIS SERVICE, CREDENTIALS FOR OUR POSTRGRES ARE NEEDED** 





