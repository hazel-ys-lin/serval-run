# ServelRun

[ServelRun | Start Your Test Journey Here](https://serval.run/)

An automated integration testing and document tool for developers and non-developers.

## Table of Contents

- [Features]()
- [Introduction]()
- [Architecture]()
- [Usage/Examples]()

## Features

- Running integration testing by 3 levels:
  - APIs' colleciton
  - Single API
  - Single scenario in an API
- Compiling [Gherkin](https://cucumber.io/docs/gherkin/) to testable documents
- Viewing real-time charts of testing results

## Introduction

- Derived from [BDD (Behavior-Driven Development)](https://cucumber.io/school/) concept, and provided an integration testing tool for non-developers
- Organized test creation and execution simultaneously with Redis queue job
- Designed multi-level tests and database schema with [MongoDB Atlas](https://www.mongodb.com/)
- Constructed test CRUD operations with RESTful API pattern
- Assured test data atomicity in the database by implementing transaction operation
- Executed integration testing with [axios](https://www.npmjs.com/package/axios)

## Architecture

- Updating real-time test status by [Redis publish/subscribe](https://redis.io/docs/manual/pubsub/)
- Utilizing WebSocket to update test result charts immediately with [Socket.IO](https://socket.io/)
  ![1006-serval-run-01](https://user-images.githubusercontent.com/61045228/195749497-3e2b1b62-6815-4dd8-8842-46e159b91ad4.png)

## Usage/Examples

#### Test account

```
email: prettyServal@gmail.com
password: 123456
```

#### How To Use

## Demo

[Demo Video (Mandarin)](https://drive.google.com/file/d/1UQXXjSv0RydYQG6Ks9tZkDoJ-x02OTWS/view)

## FAQ

#### 1. Does ServalRun support other testing language? I have never been using Gherkin to conduct testing before.

We feel sorry to inform that ServalRun only support Gherkin to generate testing document now.
However, supporting other testing language is on our to-do list.

## Author

#### Hazel Lin

- [GitHub](https://github.com/hazel-ys-lin)
- [LinkedIn](https://www.linkedin.com/in/hazel-lin-yi-sin/)
