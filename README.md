<p align="center">
  <img height="140" src="https://user-images.githubusercontent.com/2955468/63987740-58392500-caa7-11e9-8c2e-06fc5fe9b91d.png"/>
  <img height="140" src="https://user-images.githubusercontent.com/2955468/62672521-077f5200-b969-11e9-8247-a7a34540b41d.png"/>
</p>

[![build]][build-url] [![coverage]][coverage-url] [![dependabot]][dependabot-url] [![dependencies]][dependencies-url] [![dev-dependencies]][dev-dependencies-url] [![license]][license-url]

# Serverless API Starter

Demo application showing how to build a highly-performant backend service on AWS.

1. [AWS setup & configuration](#aws-setup--configuration)
1. [Lumigo setup & configuration](#lumigo-setup--configuration)
1. [Application setup & deployment](#application-setup--deployment)
1. [Deployed endpoints](#deployed-endpoints)
1. [Architecture](#architecture)
1. [Technologies & tools](#technologies-&-tools)
   1. [Key limitations](#key-limitations)
1. [Key concepts](#key-concepts)
1. [TODOs](#todos)
1. [CI/CD overview](.circleci/README.md) (link to `.circleci/README.md`)

## AWS setup & configuration

To deploy the application to AWS you'll need an account with access credentials configured locally - see the [Serverless Framework guide here](https://serverless.com/framework/docs/providers/aws/guide/credentials/). Setting up the [full AWS CLI](https://aws.amazon.com/cli/) and [configuring access via profiles](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html) is recommended, as it will allow you to access AWS resources directly when needed.

## Lumigo setup & configuration

This application is currently setup with [Lumigo](https://lumigo.io/) as a serverless monitoring and logging solution. To package and deploy the application you'll either need to setup an account and provide a Lumigo access token as environment variable (or `.env` file - see Application Setup below).

Instructions for [setting up your Lumigo account](https://docs.lumigo.io/docs) and [configuring the Lumigo serverless plugin](https://github.com/lumigo-io/serverless-lumigo-plugin).

If you don't want to use Lumigo or want to get started without it just comment out the Lumigo plugin in `serverless.yml`, and optionally comment out the Lumigo-specific configurations:

```yml
plugins:
  - serverless-webpack
  - serverless-cloudformation-resource-counter
  - serverless-plugin-iam-checker
  - serverless-plugin-test-helper
  - serverless-prune-plugin
  # - serverless-lumigo

# (commenting out the custom config is optional)
custom:
  ...
  # https://github.com/lumigo-io/serverless-lumigo-plugin
  # lumigo:
  # token: ${env:LUMIGO_TOKEN}
  # nodePackageManager: npm
```

## Application setup & deployment

**Setup local environment**

If using Lumigo, create a `.env` file with the following:

```
LUMIGO_TOKEN=<token>
```

**Install dependencies**

```bash
npm i
```

**Install dependencies**

```bash
npm i
```

**See generated swagger docs while you work**

```bash
npm run watch-docs
```

_This will start a local http server at http://localhost:8080 that renders the most up to date version of the app swagger documentation (file changes in `app/` trigger doc regeneration)._

**Deploy application to AWS**

```bash
# Using your default AWS profile
npm run deploy

# Using a named AWS profile
npm run deploy -- --aws-profile [YOUR PROFILE]
```

_Note that deploying the application for the first time to a given stage can take up to 1 hour. This is because the application makes use of CloudFront for CDN-level API caching, and when CloudFront creates a new distribution it takes a long time. **This means that when CircleCI is deploying the application to a stage for the first time it will fail due to a CircleCI timeout.** This is most common on the first deploy of a new feature branch. While CircleCI errors out the deployment continues via CloudFormation, and once the first deploy has completed subsequent deploys will complete much faster (assuming no changes to the CloudFront configurations)._

**Load snapshot data from [app/messages/sample-data/valid-messages.json](app/messages/sample-data/valid-messages.json) into the deployed DynamoDB table**

```bash
# Using your default AWS profile
npm run load-data

# Using a named AWS profile
npm run load-data -- --aws-profile [YOUR PROFILE]

# Using a named AWS profile and targeting a specific stage
npm run load-data -- --aws-profile [YOUR PROFILE] --stage [TARGETED STAGE]
```

**Run unit tests**

```bash
npm test
```

**Run e2e tests**

```bash
npm run e2e-test
```

_Note that running an e2e test requires you to first deploy the service to AWS._

**Remove application from AWS**

```bash
# Using your default AWS profile
npm run remove

# Using a named AWS profile
npm run remove -- --aws-profile [YOUR PROFILE]
```

_Note that all of the serverless commands are run through package.json scripts - this is so that people are working from a pinned version of the serverless framework as included in the package, as opposed to everyone using a global version that could span versions across multiple developer environments, potentially with slightly different side effects or other unintended differences that introduces unnecessary variance._

## Deployed endpoints

There are two endpoints available for calling the API - one via API Gateway directly, and the other through CloudFront first.

Both endpoints are included in the Output section of the generated CloudFormation Stack. You can view them in the [CloudFormation console](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks) or via the AWS CLI, etc.

![CloudFormation console](https://user-images.githubusercontent.com/2955468/66344194-3ab77080-e91b-11e9-8962-b4b4011d07c7.png)

Note that calling the API Gateway endpoint directly bypasses all caching and so won't show performance improvements on subsequent calls.

## Architecture

The first call after CDN invalidation will be a cache miss, every call thereafter will be a cache hit. Because the cache doesn't timeout arbitrarily (it's manually flushed when the data updates), this setup guarantees the highest possible cache hit rate and highest possible caching performance.

![architecture overview](diagrams/cloudcraft-architecture.png)

The api documentation is generated with swagger and hosted on a [repo-specific GitHub page](https://pariveda-accelerators.github.io/serverless-api-typescript/).

## Technologies & tools

- [Serverless Framework](https://serverless.com/framework/docs/) for managing infrastructure as code (including helpful abstractions on top of [CloudFormation](https://docs.aws.amazon.com/cloudformation/index.html)) and as a CLI for scripted deployments
- [TypeScript](https://www.typescriptlang.org/index.html) for advanced JS features and typings
- [Lumigo](https://lumigo.io/) for serverless-specific monitoring and logging

### Key limitations

- [AWS Lambda limits](https://docs.aws.amazon.com/en_pv/lambda/latest/dg/limits.html)
- Serverless Framework works best with CloudFormation, see [AWS CloudFormation limits](https://docs.aws.amazon.com/en_pv/AWSCloudFormation/latest/UserGuide/cloudformation-limits.html)
- [CloudFront limits](https://docs.aws.amazon.com/en_pv/AmazonCloudFront/latest/DeveloperGuide/cloudfront-limits.html)
- [DynamoDB limits](https://docs.aws.amazon.com/en_pv/amazondynamodb/latest/developerguide/Limits.html)

## Key concepts

TODO

## TODOs

- Add a [custom Lambda Authorizer](https://serverless.com/framework/docs/providers/aws/events/apigateway/#http-endpoints-with-custom-authorizers) function to validate that non-GET calls are from authenticated users
- Key concepts

<!-- badge icons -->

[coverage]: https://flat.badgen.net/codecov/c/github/pariveda-accelerators/serverless-api-typescript/?icon=codecov
[license]: https://flat.badgen.net/github/license/pariveda-accelerators/serverless-api-typescript
[build]: https://flat.badgen.net/circleci/github/pariveda-accelerators/serverless-api-typescript/master/?icon=circleci
[dependabot]: https://flat.badgen.net/dependabot/pariveda-accelerators/serverless-api-typescript/?icon=dependabot&label=dependabot
[dependencies]: https://flat.badgen.net/david/dep/pariveda-accelerators/serverless-api-typescript
[dev-dependencies]: https://flat.badgen.net/david/dev/pariveda-accelerators/serverless-api-typescript/?label=dev+dependencies

<!-- badge urls -->

[coverage-url]: https://codecov.io/gh/pariveda-accelerators/serverless-api-typescript
[license-url]: https://github.com/pariveda-accelerators/serverless-api-typescript
[build-url]: https://circleci.com/gh/pariveda-accelerators/serverless-api-typescript
[dependabot-url]: https://flat.badgen.net/dependabot/pariveda-accelerators/serverless-api-typescript
[dependencies-url]: https://david-dm.org/pariveda-accelerators/serverless-api-typescript
[dev-dependencies-url]: https://david-dm.org/pariveda-accelerators/serverless-api-typescript?type=dev
