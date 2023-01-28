# Handball Project

A simple project for group of enthusiastic amateur Handballers,  for a way to manage their lunch-time matches.

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Prerequisites
What things you need to install the software and how to install them

Node.js v18 or later and MySQL v8.0 or later
or
Docker v20 or later

## Installing
A step by step series of examples that tell you how to get a development env running

1) Clone the repository
```
git clone https://github.com/mikcsabee/handball.git
```

2) Install dependencies
```
npm install
```

3a) Start project with Docker
```
docker-compose up
```

3b) Start the project with local node (make sure that the `ormconfig.json` is correct and the database is exists)
```
npm start
```

The application should now be running on http://localhost:3000

4) Tests
```
npm run test
```

This will build the project and you can use the generated files in the build directory to run the application on a live system.

## Built With
 - Express - The web framework used
 - TypeScript - Language
 - TypeORM - ORM
 - MySQL - Database
