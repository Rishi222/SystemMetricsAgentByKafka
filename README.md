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
- create a new branch for Server implementation. name is ServerBranch.
- create a docker file to run the kafka or zookeeper in docker container.
- run mongo db in local via brew.
- change the broker ip to localhost because now all the service is running in local system.

## Problem 02

-- when ever router shutdown it will chnage the ip address so the system A is not able to connect to system B kafka server.
-- solution use the localhost or domain name instead of ip address.

## next idea implementation Date : 2025-09-28

- create a new server using express js to show the data in web page.
- create a new branch for server implementation. name is ServerBranch.

## View

            Device (mobile, TV, tablet)
                        |
                        | HTTP / WebSocket / REST
                        v
            Bridge Server (Node.js / Python / etc.)
                        |
                        | Kafka Producer
                        v
            Kafka Broker (System 1)
                        |
                        | Kafka Consumer
                        v
            Kafka Consumer (System 2)
                        |
                        | Store in Database (MongoDB, PostgreSQL, etc.)
                        v
            Database (MongoDB, PostgreSQL, etc.)

## Update on code Date : 2025-09-29

-Update the docker compose file to run the kafka , zookeeper and mongodb in docker container. this is also a light weight container. Or remove the mongodb space so for development purpose i can use it in local system.

- test the producer and consumer file via docker just need to change the .env file and run the docker container.

## Problem 03

-- problem is the kafka server not running properly with in docker container. But when i create a topic in kafka server via :

## Solution 03

-- CMD 1 : docker exec -it kafka /bin/bash
-- CMD 2 : cd /opt/bitnami/kafka
-- CMD 3 : bin/kafka-console-producer.sh --bootstrap-server localhost:9092 --topic MonitoringSelf

## Problem 04

-- the data is send to by the server but i want to receive the data from another system or server.

## Solution 04

-- change the code in server.js file to receive the data from another system or server backend file which is server.js but we need consumer to recieve the data.
-- For the other devices like phone , tablet or other devices i used the server.js file to send the data to kafka server.

## Update on code Date : 2025-09-30

- add the getSystemData.js file in utils folder to structure the data which is receive from child or other devices.
- Update the server.js file to use the utils/getSystemData.js file to structure the data.
- the code is test and working fine. test the code via postman.

## Update on code Date : 2025-10-01

- add the new file in utils folder name ipfinder.js or access the ip info of system via /ipinfo via get request.
- update the server.js file to use the ipfinder.js file to get the ip info of system.
- now the server.js file have two api one is /send-data or other is /ipinfo.
- the code is test and working fine. test the code via postman.
- now the server is running on PORT via .env file.
- create a new branch for login and register or forget functionality. name is LoginBranch.

## Update on code Date : 2025-10-02

- working on LoginBranch to route the user to login and register or forget password functionality.
- here i use MVC framework to structure the code.
- update the diagram for better understanding. using the eraser.io tool.
- add a new thing which is dependency for better understanding of code and each dependencies.
- add MySQL database to store the user info. or authentication related info.
- use sequelize ORM to connect with MySQL database.
- use bcrypt for password hashing.
- use jwt token for authentication purpose.
- use express-validator for validation purpose.
- use nodemailer for sending email to user for forget password functionality.
- use helmet for secure http headers.
- use cors for cross origin resource sharing.
- use express-rate-limit for rate limiting to prevent brute force attack.
- use crypto for generating secure random token for forget password functionality.
- create a new folder name controllers to handle the logic of login , register and forget password functionality.
- create a new folder name models to handle the database models or schema.
- create a new folder name routes to handle the routes of login , register and forget password functionality.
- create a new file name authController.js in controllers folder to handle the logic of login , register and forget password functionality.
- create a new file name User.js in models folder to handle the database models or schema.
- create a new file name authRoutes.js in routes folder to handle the routes of login , register and forget password functionality.
- create a new file name db.js in config folder to handle the database connection.
- update the server.js file to use the routes and connect with database.
- create a new file name .env to store the environment variables.

## Update on code Date : 2025-10-03

- the signup,login or logout functionality is working fine.
- still want to check the forget password functionality because i use the gmail smtp server to send the email to user. so need to check it properly.

## Update on code Date : 2025-10-04

- currently working on the email module or set-up it properly via .env or email.js file.
- check the email.js file from scratch or check the logic twice now moving to check the working.
- check the forget or reset-password functionality it work perfect via postman.
- the thing is you need to generate a 16 digit app password via google to use with gmail.
- correct all the error from the file authController.js update the docker-compose.yml file.

## Update on code Date : 2025-10-05

- working on developing frontend inside the LoginBranch.
- Build the frontend using ReactJS. add material.ui or tailwind CSS to this project make it simple or better.
- first is to create the frontend for the login,signup,forgetpassword created.
- second additional thing like navbar,notfoundpage,aboutpage created.
- add logo to the navbar.
- move to push the current things to git.
- working on smoothing the login , signup functionaliy.
- add more pages to it like UnauthorizedPage, inside ./pages/dashboards -> admin , consumer , producer dashboards file.  add a authcheck to the page which help me check the user is currently the right user or not.

## Update on code Date : 2025-10-06

- create inner ui similar to login , signup or other's like in admin , consumer , producer dashboards.
- add the functionality improvement in login,signup,forget-password or other by connecting the backend to it.
- resolve the error at login or signup.
- update the authController.js or auth.js for the signup functionality due to role is misplaces in backend responce.
- now the signup or login working is to good.

## Problem 05

-- login logic doesn’t verify that the selected role in the URL matches the user’s actual role returned by the backend.

## Solution 05 

-- add a small check for the role for backend or from where the user came from like from producer login or other. if both match login else show role mismatch in this.

## Update on code Date : 2025-10-07 

- working on the login fault now it is working well or moving to next part which is enhancing the signup as well for this same problem.
- resolve the forget-password connection error when we try to forget the password the role mismatch error resolved.
- the email.js is now contain some new feature like when i forget the password it don't just give link it also view in a good way.
- create the resetPassword.html file which help me to get a good view at when the user send the forget-password link.
- this resetPassword.html is connected at authController.js.
- now working move to working on ResetPasswordPage.jsx to reset working. or the application is now start via.
- npm run dev -- --host 0.0.0.0 instead of npm run dev .
- working or /reset-password at backend or frontend both file.
- resolve the /reset-password bug conflict via tokens.
- now both the frontend or backend is connected or work with full potential of auth services, the auth service is check via frontend but not the postman. but work good.

## Problem 06 

-- bug in /reset-password when every try to update the password at backend it shows successfully or the frontend redirect to dashboard but the thing is that it does not save the password in the database or not redirect to login screen also.

## Solution 06

-- the main bug found at backend code where the /reset-password is situated when i store the hash token or password in the database.

## Update on code Date : 2025-10-09

- so today the main task is to pull all the code to main from LoginBranch.
- then after that start working on the Branch again.
- the LoginBranch Code is merge to main branch now moving to work on dashboard but before that first clean the /api/auth or authController.js code 
- after that move to update the diagram with current work flow.
- create a new branch for dashboard clean up or authController.js file code. Name of the branch is CleanAuthBranch.

## Git Hub Branch

- main
- Testing
- MongoBranch : the work of this branch is to add mongo db support (now remove this branch because all the code is merge to the main branch)
- ServerBranch : the work of this branch is to add server support which help to connect the service through web services
- IPfinderBranch : the work of this branch is to find the public ip address of system using third party api and store them to mongo db + the consumer info who logged in or work as a consumer in site
- LoginBranch : the work of this branch is to add the login and register etc functionality using jwt token and bcrypt for password hashing. this branch is use to build the authentication system. via SQL database.
- CleanAuthBranch : this branch is to clean or maintain clear code at backend side. or clear frontend as well.

## Dependencies

- express → Web framework for handling routes, middleware, and HTTP requests.
- sequelize → ORM for interacting with MySQL using models instead of raw SQL.
- mysql2 → MySQL client for Sequelize to connect with the database.
- bcrypt → Secure password hashing and comparison.
- jsonwebtoken (JWT) → Token-based authentication for secure user sessions.
- dotenv → Loads environment variables from .env file.
- cookie-parser → Parses and manages cookies (used for storing auth tokens).
- express-validator → Middleware for validating and sanitizing user input.
- nodemailer → Sends emails (used for password reset, notifications, etc.).
- helmet → Adds secure HTTP headers to protect against common attacks.
- cors → Enables secure cross-origin requests (frontend ↔ backend).
- express-rate-limit → Protects against brute-force and DDoS attacks by limiting requests.
- crypto → Node.js built-in module for generating secure random tokens & hashing.
- kafka → Apache Kafka client for producing and consuming messages.
- mongoose → ODM for interacting with MongoDB using schemas and models.
- systeminformation → Retrieves detailed system and hardware information.
