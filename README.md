# ServelRun

![serval-run_logo-2](https://user-images.githubusercontent.com/61045228/195865863-f59a68aa-3924-4f81-913f-ec46fdfd2104.png)
[ServelRun | Test Your Server as Rapid as Serval](https://serval.run/)

An automated integration testing and document tool for developers and non-developers.

#### Test account

We now welcome everyone join testing our testing service!

```
email: prettyServal@gmail.com
password: 123456
```

## Tech Stacks

<!-- [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/) -->

![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

![AWS](https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white)

![pug](https://img.shields.io/badge/Pug-E3C29B?style=for-the-badge&logo=pug&logoColor=black)
![CodeMirror](https://img.shields.io/badge/CodeMirror-D30707?style=for-the-badge&logo=CodeMirror&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=Socket.io&logoColor=white)
![BootStrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![FontAwesome](https://img.shields.io/badge/Font_Awesome-339AF0?style=for-the-badge&logo=fontawesome&logoColor=white)

## Table of Contents

- [Features](#Features)
- [Introduction](#Introduction)
- [Technologies](#Technologies)
- [Architecture](#Architecture)
- [Usage/Examples](#Usageexamples)
- [FAQ](#FAQ)
- [Author](#Author)

## Features

- Running integration testing by 3 levels:
  - APIs' colleciton
  - Single API
  - Single scenario in an API
- Compiling [Gherkin](https://cucumber.io/docs/gherkin/) to testable documents
- Viewing real-time charts of testing results

## Introduction

We need to write documents when developing.

We also need to write tests when developing.

How about testable documents, which combine these two important tasks and execute it in the meantime?

That's why ServelRun born.

```gherkin
Feature: Sign in
user system to make user sign in

  @signin
  Scenario Outline: user sign in
    Given I am an existing <provider> user
    And I have entered <email> in the form
    And I have entered <password> into the form
    When I press signin
    Then the result should be <status> on the screen

    Examples:
      | provider | email             | password      | status |
      | native   | serval@gmail.com  | Serval123     |    200 |
      | native   | serval@gmail.com  | Serval1234444 |    403 |
      | native   | serval@gmail.com  | Serval1234444 |    404 |
      | native   | admin@company.com | admin123      |    200 |
```

For example, this snippet of code (or text) can be compiled into specification datasheet for conducting tests.

- **Feature** means what feature this snippet is going to test.
- **Scenario Outline** means under this circumstance, all the steps of this test.
- **Examples** indicates the data which will be sent to the target server.

That's how it works. This is the magic of Gherkin and BDD.
ServalRun utilized the power of this language, turning single test under single scenario to integration testing.

Start your test journey now by creating an account.

Happy testing!

## Technologies

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

#### How To Use

1. Sign In

- Here is the test account you may get started without registering a new one:

```
email: prettyServal@gmail.com
password: 123456
```

![index&signin](https://user-images.githubusercontent.com/61045228/195796252-315136ba-e659-47c8-bed0-f159c00cdcde.gif)

2. View Project

![project](https://user-images.githubusercontent.com/61045228/195796271-916665ed-543b-44df-8dc1-81aabda9d518.gif)

3. Set up environment

- Create environment to use different domain name or IP address to request your API.
- When setting up new environment, you may add develop stage such as "develop", "staging", or "production", etc.

![environment](https://user-images.githubusercontent.com/61045228/195796292-6fff5a73-fe7a-4dbf-8138-81757f60b702.gif)

4. Create collection

- Collection may include multiple APIs.
  - For example, under "user" collection, "sign up", "sign in" and "profile" may all be included.
- What's better is that ServalRun can run collection test (which means run bulk of APIs) by one click!

![collection](https://user-images.githubusercontent.com/61045228/195796305-dad51831-7807-4d0e-9491-92967e9a5109.gif)

5. The environments and the collections are both editable

- Click on the pencil icon to modify the environments and collections whenever you want.

![edit](https://user-images.githubusercontent.com/61045228/195796354-8ae8d7e0-9490-465b-b870-88cc35631229.gif)

6. Create API

- When creating API to test, users need to provide informations as below:
  - API endpoint
  - HTTP method
  - Severity of the API

![api](https://user-images.githubusercontent.com/61045228/195796374-78e857da-a7da-40e1-96d3-0594119e7974.gif)

7. Create scenario

- Write your first testable document with Gherkin!
  - There is already a short snippet of gherkin example document in the creating scenario form. Feel free to test it!

![scenario](https://user-images.githubusercontent.com/61045228/195796399-0a699c6f-7b9b-4fce-a60d-508453f25ea3.gif)

8. Run tests in scenario/API/collection level

![run-test](https://user-images.githubusercontent.com/61045228/195796417-b5427eb5-2ada-4bbf-9662-2abe2cb1b1d0.gif)

9. Check the reports

![report](https://user-images.githubusercontent.com/61045228/195796438-db697d84-bf36-4b45-90ca-33d6e358e38d.gif)

## Demo

[Demo Video (Mandarin)](https://drive.google.com/file/d/1UQXXjSv0RydYQG6Ks9tZkDoJ-x02OTWS/view)

## FAQ

#### Does ServalRun support other testing language? I have never been using Gherkin to conduct testing before.

We feel sorry to inform that ServalRun only support Gherkin to generate testing document by now.

However, supporting other testing language is on our to-do list.

## Author

#### Hazel Lin

- [GitHub](https://github.com/hazel-ys-lin)
- [LinkedIn](https://www.linkedin.com/in/hazel-lin-yi-sin/)

Or email me at: hazel.ys.lin@gmail.com
