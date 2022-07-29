# Express Node.js API Server Boilerplate with JWT and PostgreSQL

This is a boilerplate for projects requiring:

* Backend with JWT REST API.
* Access to PostgreSQL from your backend


* Project status: development/prototype
* Developed by Andrew Tite

  andrewtite@gmail.com

  [<img src="https://img.shields.io/badge/gmail-%23DD0031.svg?&style=for-the-badge&logo=gmail&logoColor=white"/>](mailto:andrewtite@gmail.com)

A <strong>legal JWT</strong> must be added to <strong>HTTP Header</strong> if Client accesses protected resources.

A <strong>refreshToken</strong> will be provided at the time user signs in.

![JWT Flow Diagram](jwt-refresh-token-node-js-example-flow.png "JWT Flow Diagram")

## Installation
* Clone git repo
* Make sure latest node, npm, and yarn are installed
* Install required node packages from the command line: `npm install`
* Run server from the command line: `node server.js`

# Available REST API Requests
There are several basic API calls out of the box.

## Sign Up

### Request

`POST /api/auth/signup`

```
curl --location --request POST 'http://localhost:8080/api/auth/signup' \
     --header 'Content-Type: application/json' \
     --data-raw '{ \
        "username": "mod", \ 
        "email": "mod@example.com", \ 
        "password": "123456789", \
        "roles": ["user", "moderator"] \
     }'
```
### Response

    HTTP/1.1 201 Created
    Date: Fri, 29 Jul 2022 17:01:23 GMT
    Status: 201 Created
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json
    Content-Length: 47

    {"message":"User was registered successfully!"}

## Sign In

### Request

`POST /api/auth/signin`

```
curl --location --request POST 'http://localhost:8080/api/auth/signin' \
     --header 'Content-Type: application/x-www-form-urlencoded' \
     --data-urlencode 'username=mod' \
     --data-urlencode 'password=123456789'
```

### Response

    HTTP/1.1 200 Success
    Date: Fri, 29 Jul 2022 17:01:23 GMT
    Status: 200 Success
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json
    Content-Length: 244

    {
      "id":1,
      "username":"mod",
      "email":"mod@example.com",
      "roles":["ROLE_USER","ROLE_MODERATOR"],
      "accessToken":"eyJh...nYfo"
    }

## Use Refresh Code to get New API Access Code

### Request

`POST /api/auth/refreshCode`

```
curl --location --request POST 'http://localhost:8080/api/auth/refreshToken' \
     --header 'Content-Type: application/json' \
     --data-raw '{
        "refreshToken": "728d...0462"
     }'
```

### Response

    HTTP/1.1 200 Success
    Date: Fri, 29 Jul 2022 20:05:31 GMT
    Status: 200 Success
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json
    Content-Length: 209

    {
        "accessToken": "eyJh...kCfE",
        "refreshToken": "728d...0462"
    }

## Access Protected User Resource

Check if user has access to public resources.

### Request

`GET /api/test/all`

```
curl --location --request GET 'http://localhost:8080/api/test/all'
```

### Response

    HTTP/1.1 200 Success
    Date: Fri, 29 Jul 2022 17:01:23 GMT
    Status: 200 Success
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: text/html
    Content-Length: 14

    Public Content

## Access Protected Moderator Resource

Check if user has access to moderator resources.

### Request

`GET /api/test/mod`

```
curl --location --request GET 'http://localhost:8080/api/test/mod' \
     --header 'x-access-token: eyJh...nYfo'
```

### Response

    HTTP/1.1 200 Success
    Date: Fri, 29 Jul 2022 17:01:23 GMT
    Status: 200 Success
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: text/html
    Content-Length: 17

    Moderator Content

## Access Protected Admin Resource

Check if user has access to administrator resources.

### Request

`GET /api/test/admin`

```
curl --location --request GET 'http://localhost:8080/api/test/admin' \
     --header 'x-access-token: eyJh...nYfo'
```

### Response

    HTTP/1.1 200 Success
    Date: Fri, 29 Jul 2022 17:01:23 GMT
    Status: 200 Success
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: text/html
    Content-Length: 13

    Admin Content
