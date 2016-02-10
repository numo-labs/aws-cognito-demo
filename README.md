# aws-cognito-demo

> AWS Cognito demo

Amazon Cognito is a service that makes it easy to save user data in the AWS Cloud without writing any backend code or managing any infrastructure.

## Run locally

```
$ npm install
$ bower install
$ npm start
```

## What's inside

**Initialize hello.js with Google ID**

`Hello.js` — it is a client-side library that simplify authenticating.

```js
  hello.init({
    google: '1007282893537-d12afmkgp97mjfa1plp7g4caginmkam9.apps.googleusercontent.com'
  }, {
    redirect_uri: window.location.href
  });
```

**Add listener that triggered whenever a user logs in**

```js
  hello.on('auth.login', this.getUserInfo.bind(this));
```

**Add listeners for the user login**

Add listener, which will load a user profile into the page after they sign in.

```js
  hello(auth.network).api('/me').then(user => {
    // set user data to the application state
  });
```

**Set configuration for AWS**

```js
  AWS.config.region = 'eu-west-1';
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'eu-west-1:6c92ef81-d98a-4d97-8622-7274a5326309',
    Logins: {
      'accounts.google.com': auth.authResponse.id_token
    }
  });
```

**Connect to AWS and get data from Cognito Cloud**

```js
  // get AWS credentials, so we can connect
  AWS.config.credentials.get(() => {
    // connect to cognito
    cognito.client = new AWS.CognitoSyncManager();

    // open or create new dataset
    cognito.client.openOrCreateDataset('DataSet', (err, dataset) => {
      cognito.dataSet = dataset;

      // get data from Cloud by the key
      dataset.get('DataKey', (err, data) => {
        // set data to the application state
      });

    });
  });
```

**Put updated data to the Cognito Cloud**

```js
  cognito.dataSet.put('DataKey', 'DataValue', (err, record) => {
    // handler code here
  });
```

### Libraries

 * https://github.com/aws/aws-sdk-js - AWS SDK for JavaScript in the browser and Node.js
 * https://github.com/aws/amazon-cognito-js - Amazon Cognito Sync Manager for JavaScript
 * http://adodson.com/hello.js/ - A client-side JavaScript SDK for authenticating with OAuth2
