import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Vpc, SecurityGroup } from 'aws-cdk-lib/aws-ec2';
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

    const DefaultVpc = Vpc.fromLookup(this, 'VPC', {
      vpcId: 'vpc-0fcadc69f2c1c254a',
    });

    const sg = SecurityGroup.fromLookupById(
      this,
      'lambda-rds-sg',
      'sg-0f3b2c5a843ecd099',
    );

    const cartAPILambda = new NodejsFunction(this, 'cartAPILambda', {
      entry: join(__dirname, '..', '..', 'dist', 'lambda.js'),
      functionName: 'cartLambda',
      runtime: Runtime.NODEJS_18_X,
      timeout: cdk.Duration.seconds(30),
      bundling: {
        nodeModules: getDependenciesList(
          join(__dirname, '..', '..', 'package.json'),
        ),
      },
      allowPublicSubnet: true,
      environment: {
        DB_HOST: process.env.DB_HOST ?? '',
        DB_PORT: process.env.DB_PORT ?? '',
        DB_NAME: process.env.DB_NAME ?? '',
        DB_USERNAME: process.env.DB_USERNAME ?? '',
        DB_PASSWORD: process.env.DB_PASSWORD ?? '',
      },
      securityGroups: [sg],
      vpc: DefaultVpc,
      depsLockFilePath: join(__dirname, '..', '..', 'package-lock.json'),
    });

    cartAPILambda.role?.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        'service-role/AWSLambdaVPCAccessExecutionRole',
      ),
    );

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
