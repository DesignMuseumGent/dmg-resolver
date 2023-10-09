# RESOLVER  - DESIGN MUSEUM GENT
Node-based service, part of the museum data infrastructure, to maintain a healthy upstream for the [REST-API](https://github.com/designmuseumgent/dmg-rest-api) of Design Museum Gent.

## WHAT IT DOES. 
* each week (on sunday) the museums' postgres database is vetted for inconsistencies and errors - to ensure a healthy upstream.
* inconsistencies include (entity duplicates, HTTP Client and/or Server errors, misalignment between PID and metadata (due to changes in registration (fe. changing objectnumber) f.e.))
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
RESOLVE_TO: https://data.designmuseumgent.be/id/object/0559
----------
1/5864
checking: https://data.designmuseumgent.be/id/object/2017-0448
IIIF Manifest Response: 200
objectnumber in LDES: 2017-0448
content in LDES matches with PID
STATUS: HEALTHY
RESOLVE_TO: https://data.designmuseumgent.be/id/object/2017-0448
----------
```

## SETUP
this service has dependencies that rely on private credentials. - setting up this service, is only possible in correspondence with the museum. 

### install dependencies 
make sure node is installed on the device

```
npm install 
```

add .env file at root level of the repository
```
touch .env
```

fill in the credentials in .env file: 
```
_baseURI="https://data.designmuseumgent.be/
SUPABASE_URL= *****
SUPABASE_KEY= *****
```

### run service
we run this service on a raspberrypi.

move in the directory 
```
cd dmg-resolver
```

start check
```
npm start
```









