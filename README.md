# ServelRun

[ServelRun | Test Your Server as Rapid as Serval](https://serval.run/)

An automated integration testing and document tool for developers and non-developers.

## Table of Contents

- [Features](https://github.com/hazel-ys-lin/serval-run/blob/main/README.md#Features)
- [Introduction](https://github.com/hazel-ys-lin/serval-run/blob/main/README.md#Introduction)
- [Technologies](https://github.com/hazel-ys-lin/serval-run/blob/main/README.md#Technologies)
- [Architecture](https://github.com/hazel-ys-lin/serval-run/blob/main/README.md#Architecture)
- [Usage/Examples](https://github.com/hazel-ys-lin/serval-run/blob/main/README.md#Usageexamples)
- [FAQ](https://github.com/hazel-ys-lin/serval-run/blob/main/README.md#FAQ)
- [Author](https://github.com/hazel-ys-lin/serval-run/blob/main/README.md#Author)

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
- **Scenario Outline** means under this circanstance, all the steps of this test.
- **Examples** indicates the data which will be send to the target server.

That's how it works. This is the magic of Gherkin and BDD.
ServalRun utilized the power of this language, turning single test under single scenario to integration testing.
Start your test journey now by creating an account. Happy testing!

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

#### Test account

```
email: prettyServal@gmail.com
password: 123456
```

#### How To Use

1. Sign In

![index&signin](https://user-images.githubusercontent.com/61045228/195790097-2c74e1d4-defc-4ed1-bdba-41e9186dd777.gif)

2. Check Project

![project](https://user-images.githubusercontent.com/61045228/195790995-ff8f84d1-2b86-44a5-96de-f0a56fad470d.gif)

3. Create environment

![environment](https://user-images.githubusercontent.com/61045228/195791012-d0025bbb-7fff-4294-86f0-a0e6fd36a184.gif)

4. Create collection

![collection](https://user-images.githubusercontent.com/61045228/195791022-6c974ab1-75e1-4ff5-8049-3bb47f1138fa.gif)

5. The environments and the collections are both editable

![edit](https://user-images.githubusercontent.com/61045228/195791034-fae11429-251d-4e0b-b70a-9c2708267f6d.gif)

6. Create API

![api](https://user-images.githubusercontent.com/61045228/195791046-116e015a-ba0e-4691-b185-327f3448a4ba.gif)

7. Create scenario

![scenario](https://user-images.githubusercontent.com/61045228/195791070-825f05c4-0692-4486-a2d1-02e8810ab589.gif)

8. Run tests in scenario/API/collection level

![run-test](https://user-images.githubusercontent.com/61045228/195791076-7c00fbb6-fb38-4c55-854a-fddc716cb63c.gif)

9. Check the reports

![report](https://user-images.githubusercontent.com/61045228/195791093-ac9fbe91-0ace-4330-99f1-64cc17664f37.gif)

## Demo

[Demo Video (Mandarin)](https://drive.google.com/file/d/1UQXXjSv0RydYQG6Ks9tZkDoJ-x02OTWS/view)

## FAQ

#### 1. Does ServalRun support other testing language? I have never been using Gherkin to conduct testing before.

We feel sorry to inform that ServalRun only support Gherkin to generate testing document by now.

However, supporting other testing language is on our to-do list.

## Author

#### Hazel Lin

- [GitHub](https://github.com/hazel-ys-lin)
- [LinkedIn](https://www.linkedin.com/in/hazel-lin-yi-sin/)
