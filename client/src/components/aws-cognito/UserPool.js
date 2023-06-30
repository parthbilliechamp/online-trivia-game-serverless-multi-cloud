import { CognitoUserPool } from "amazon-cognito-identity-js";

const userPoolId = process.env.REACT_APP_USER_POOL_ID;
const clientId = process.env.REACT_APP_USER_POOL_CLIENT_ID;
const poolData = {
  UserPoolId: "us-east-1_OsZxYmjIH",
  ClientId: "umlids9prbksb5eupfj18blsd",
};

const userPool = new CognitoUserPool(poolData);
export default userPool;
