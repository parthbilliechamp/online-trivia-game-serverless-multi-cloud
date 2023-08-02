import React, { useEffect } from 'react';
import { APP_LOGIN_URL } from '../constants';

function LoginRedirect() {
  useEffect(() => {
    window.location.replace(APP_LOGIN_URL);
  }, []);

  return <></>;
}

export default LoginRedirect;