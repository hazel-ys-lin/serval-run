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
  ![Architecture](https://serval-bucket.s3.ap-northeast-1.amazonaws.com/1006-serval-run-01.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLW5vcnRoZWFzdC0yIkcwRQIhAOfmynwIA0w6TjTyPo7el2H8Q0oFpQtuseUrqXMpRTkTAiBqQvXCNfIKb1y0dD0aNnTOjI1ZSDRdLWO1Cq3e0nEMTSrxAgiz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzMTcxNjM3Mjc2MyIM6P48y3GIxeE2xXlKKsUCmEGYCB4AV4oiLtQWikCHz0qdT3azkmWdDO6apTO1MFJL7LBcr15b2ptIkN%2FTJGGbjScjsUYpGn23UhixsbGGLo56iFPcUZS4I9V3sKW5CFMEvuuyKjF4eUbuFLE6zKR4MV8wUK%2FWIB%2F6HEeu%2FlV7a1%2FxuikeVe%2FhNcXqM8x7aSPb6%2BX7KYsPNZV9nv1Ycxf0rEUlpg1PPMEhD7LKWiUQNU63ADagTrzpSZzOHKQl4XDGZO%2BiYdwepkRTpzYYsddKZJR%2Bj7Tf8OkIzksFTk2wRchH2X2huuB5SUMSapRu99rJmw0V1437Qz%2FXeDeWt8Pws3QeTjEFKlb5YmAWIs3dEi6lrrkMDWL%2Buu6zmW%2BPXmKHMSrZqNCRai3o36jaC3GIkfqpXA8guEs3UBfVF%2Fxgtc%2Bc5psLEqYDUqKyaFLr5jlZJm3rETC0%2BKKaBjqzAgbtGYT45eeS9jedWd4GlR%2F7aHtN5dr2vm5IsG6dTYLOQ7StmBNpo3OE%2FYtAu3DwK65X7pJpM9aBr%2Fj0WvGUjdr1ToJadVlCtdpTvGRxwWolnl5iu%2B1%2BBhqSBJHnRTsZn%2FQDRdU0%2FXw%2Bl72TH1EWEAe0tJPFJcfI1B4sR2tfWE4dl4c2dA6hSe2V5nQU4oqXsx%2Bv9jlz7AqD814CJneSQcy7BLwmm0SGUxugxdc7HATjqo6u8HFGV4rVtxyYdKstF%2FDYbBVEUngNuDjqrFIlIxp8AomVGUhkFB7gLJJdCaExYX%2BFFYc7tqvmmo0%2BV8lJ6hfYsH0OvBo1l3YheqViID2RSnrt1FP0EOGyBg0f2PFOpIV1Awotpa7YAS90Uv6RCJLNmUlwUsWT0%2FO8%2B%2BWIaztztR8%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20221014T013800Z&X-Amz-SignedHeaders=host&X-Amz-Expires=299&X-Amz-Credential=ASIAZGFJ24EN3MP2XSVO%2F20221014%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Signature=0b194a45d2dc3ccc110931f5e26f49e8095da675ec24b55f0b0cce5441da2077)

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
