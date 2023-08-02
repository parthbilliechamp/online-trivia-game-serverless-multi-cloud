import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "us-east-1_OsZxYmjIH",
  ClientId: "umlids9prbksb5eupfj18blsd",
};

const userPool = new CognitoUserPool(poolData);
export default userPool;
