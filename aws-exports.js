const awsExports = {
  Auth: {
    mandatorySignIn: false,
    identityPoolId: REACT_APP_COGNITO_IDENTITY_POOl_ID,
    authenticationFlowType: REACT_APP_COGNITO_AUTH_FLOW_TYPE,
    region: REACT_APP_COGNITO_REGION,
    userPoolId: REACT_APP_COGNITO_USER_POOL_ID,
    userPoolWebClientId: REACT_APP_COGNITO_APP_CLIENT_ID,
    mqtt_id: REACT_APP_COGNITO_MQTT_ID,
  },
  Storage: {
    DEVICE: {
      bucket: REACT_APP_STORAGE_DEVICE_BUCKET,
      identityPoolId: REACT_APP_COGNITO_IDENTITY_POOl_ID,
      region: REACT_APP_COGNITO_REGION,
    },
    PROFILE: {
      bucket: REACT_APP_STORAGE_PROFILE_BUCKET,
      identityPoolId: REACT_APP_COGNITO_IDENTITY_POOl_ID,
      region: REACT_APP_COGNITO_REGION,
    },
  },
};

export default awsExports;
