# SystemMetricsAgentByKafka

Build a system metrics agent with kafka for real time system dashboard viewer.

## Prerequisites

- Java 8 or higher
- Maven
- Kafka server
- Zookeeper server  

## Updates on code Date : 2025-09-26

- update the server from localhost to 0.0.0.0 which help me to connect the server from other machine.
- clear the code at producer or consumer side.
- connect system A to system B using IP address of system B.
- now the kafka server is running on system B and system A is sending the data to system B kafka server.
- connect the folder to git hub.
- add the readme file.
- clear the code which is not required.
- remove the unwanted code from producer and consumer file.

## Problem 01

-- problem the ip change if new ip assigned to system B then system A is not able to connect to system B kafka server.
-- solution use the domain name instead of ip address.

## Solved the problem 01 Date : 2025-09-27

## Update on code Date : 2025-09-27

- start a new branch for Testing purpose.
- add the new file for testing purpose.
- use grafana/k6 for testing purpose.
- to see switch to Testing branch.

## Update on code Date : 2025-09-28

- add some changes in producer file where now i use mongo db to store the data.
- create a new schema for mongo db to store the data. name is SystemData.js
- now the data is store in mongo db and also send to kafka server.
- implementing the mongo db in producer file to create a multi purpose data handling from parents or child relation.
- seprate the connection string of mongo db in config folder.
- seprate the connection string of kafka in config folder.
- now the data is store in mongo db and also send to kafka server. consumer is now clear.

## Git Hub Branch

-main
-Testing
-MongoBranch (now remove this branch because all the code is merge to the main branch).