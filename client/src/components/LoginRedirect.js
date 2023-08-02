import React, { useEffect } from 'react';
import { APP_LOGIN_URL } from "../constants.js";

function LoginRedirect() {
  useEffect(() => {
    window.location.replace("https://trivia-quiz.auth.us-east-1.amazoncognito.com/login?client_id=umlids9prbksb5eupfj18blsd&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=https%3A%2F%2Ffrontendapp-7l4cel6fjq-ue.a.run.app%2Flogin%2F");
  }, []);

  return <></>;
}

export default LoginRedirect;