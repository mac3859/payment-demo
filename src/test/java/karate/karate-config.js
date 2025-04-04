function fn() {
  var env = karate.env; // get java system property 'karate.env'
  karate.log('karate.env system property was:', env);

  var config = {
    apiUrl: 'https://api.payment-service.com/v1',
    test: {
      token: 'test-token-for-api-testing'
    }
  }

  if (env == 'dev') {
    config.apiUrl = 'http://localhost:8080/v1';
  } else if (env == 'staging') {
    config.apiUrl = 'https://staging-api.payment-service.com/v1';
  }

  return config;
}