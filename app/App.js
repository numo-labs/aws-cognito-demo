import React from 'react';
import ReactDOM from 'react-dom';
import hello from 'hellojs';

let cognito = {
  client: {},
  dataSet: {}
};

export default class App extends React.Component {
  constructor () {
    super();
    this.state = {
      logged: false,
      userInfo: {},
      spinner: false
    }
  }

  componentDidMount () {

    // Initialize hello.js with Google ID
    hello.init({
      google: '1007282893537-d12afmkgp97mjfa1plp7g4caginmkam9.apps.googleusercontent.com'
    }, {
      redirect_uri: window.location.href
    });

    let authResponse = hello('google').getAuthResponse();

    if (authResponse) {
      this.setState({
        spinner: true
      });
    }

    // Listen auth.login event, fires when logged
    hello.on('auth.login', this.getUserInfo.bind(this));
  }

  getUserInfo (auth) {
    this.setState({
      spinner: true
    });

    // lookup user profile info from the identity provider
    hello(auth.network).api('/me').then(user => {

      // set user info
      this.setState({
        logged: true,
        userInfo: {
          name: user.name,
          thumbnail: user.thumbnail
        }
      });
    });

    // AWS config
    AWS.config.region = 'eu-west-1';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'eu-west-1:6c92ef81-d98a-4d97-8622-7274a5326309',
      Logins: {
        'accounts.google.com': auth.authResponse.id_token
      }
    });

    // get AWS credentials, so we can connect
    AWS.config.credentials.get(() => {
      // connect to cognito
      cognito.client = new AWS.CognitoSyncManager();

      // open or create new dataset
      cognito.client.openOrCreateDataset('DataSet', (err, dataset) => {
        cognito.dataSet = dataset;

        // get data from Cloud by the key
        dataset.get('DataKey', (err, content) => {
          this.setState({
            spinner: false,
            text: content ? content : 'Type something...'
          });
        });

      });
    });
  }

  triggerLogin () {
    hello('google').login({
      response_type: 'code'
    });
  }

  triggerLogout (e) {
    e.preventDefault();

    hello('google').logout({
      force: true
    });

    // clear cognito cache ID, so the user can sign-in from another account
    AWS.config.credentials.clearCachedId();

    this.setState({
      logged: false,
      userInfo: {}
    });
  }

  changeInputData (e) {
    // save data to the cognito storage by the key
    cognito.dataSet.put('DataKey', e.target.value, (err, record) => {
      this.setState({
        text: record.value
      });
    });
  }

  /**
   * Render methods
   */
  render () {
    return (
      <div>
        <h2>Cognito demo</h2>
        { this.renderPage() }
      </div>
    );
  }

  renderPage () {
    const { spinner, logged, userInfo } = this.state;

    if (spinner) return <div>Loading...</div>;

    if (!logged) {
      return this.renderNotLogged();
    } else {
      return this.renderUserInfo(userInfo);
    }
  }

  renderNotLogged () {
    return (
      <div>
        <button onClick={this.triggerLogin.bind(this)}>Sign-In with Google</button>
      </div>
    );
  }

  renderUserInfo (userInfo) {
    return (
      <div>
        <div>
          <div>{userInfo.name} <a href='' onClick={this.triggerLogout.bind(this)}>Logout</a></div>
          <img src={userInfo.thumbnail} />
        </div>
        <div>
          <input value={this.state.text} onChange={this.changeInputData.bind(this)} />
        </div>
      </div>
    );
  }
}
