# User API Spec

## Register User API

Endpoint : POST /api/users

Request Body :

```json
{
  "username": "fadhil",
  "password": "rahasia",
  "name": "Programmer Zaman Now"
}
```

Response Body Success :

```json
{
  "data": {
    "username": "fadhil",
    "name": "Programmer Zaman Now"
  }
}
```

Response Body Error :

```json
{
  "error": "Username Already registered"
}
```

## Login User API

Endpoint : POST /api/users/login

Request Body :

```json
{
  "username": "fadhil",
  "password": "rahasia",
}
```

Response Body Success :

```json
{
  "data": {
    "token": "unique-token"
  }
}
```

Response Body Error :

```json
{
  "errors": "Username or password wrong"
}
```

## Update User API

Endpoint : PATCH /api/users/current

Request Body :

```json
{
  "name" : "Fadhil", // optional
  "password" : "new password" //optional
}
```

Response Body Success :

```json
{
  "data" : {
    "username" : "fadhil",
    "name" : "Fadhilah Dwi A"
  }
}
```

Response Body Error :

```json
{
  "errors": "Name length max 100"
}
```

## Get User API

Endpoint : GET /api/users/current

Headers :
- Authorization : token

Response Body Success :

```json
{
  "data" : {
    "username" : "fadhil",
    "name" : "Fadhilah Dwi A"
  }
}
```

Response Body Error :

```json
{
  "errors": "Unauthorized"
}
```

## Logout User API

Endpoint : DELETE /api/users/logout

Headers :
- Authorization : token

Response Body Success :

```json
{
  "data" : "OK"
}
```

Response Body Error :

```json
{
  "errors": "Unauthorized"
}
```
