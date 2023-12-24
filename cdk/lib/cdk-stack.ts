import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import { readFileSync } from 'fs';

function getDependenciesList(packageJsonPath: string) {
  try {
    // Read and parse the package.json file
    const data = readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(data);

    // Extract dependencies
    const dependencies = packageJson.dependencies || {};
    const dependencyList = Object.keys(dependencies);

    return dependencyList;
  } catch (error) {
    console.error(
      `Error reading/parsing package.json: ${(error as Error).message}`,
    );
    return [];
  }
}
export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cartAPILambda = new NodejsFunction(this, 'cartAPILambda', {
      entry: join(__dirname, '..', '..', 'dist', 'src', 'lambda.js'),
      functionName: 'cartLambda',
      runtime: Runtime.NODEJS_18_X,
      timeout: cdk.Duration.seconds(30),
      bundling: {
        nodeModules: getDependenciesList(join(__dirname, '..', '..', 'package.json')),
      },
      environment: {},
      depsLockFilePath: join(__dirname, '..', '..', 'package-lock.json'),
    });

    const cartAPILambdaIntegration = new apigw.LambdaIntegration(cartAPILambda);
    // Create an API Gateway resource for each of the CRUD operations
    const api = new apigw.RestApi(this, 'cartAPI', {
      restApiName: 'Cart Service',
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
        allowHeaders: apigw.Cors.DEFAULT_HEADERS,
      },
      deployOptions: {
        stageName: 'dev',
      },
      // In case you want to manage binary types, uncomment the following
      // binaryMediaTypes: ["*/*"],
    });

    const cart = api.root.addResource('{proxy+}');
    cart.addMethod('ANY', cartAPILambdaIntegration);
  }
}
