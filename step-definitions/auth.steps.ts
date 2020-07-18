import {after, binding, then, when} from "cucumber-tsflow/dist";
import {assertThat, greaterThan, hasSize, is} from "hamjest";
import instance from './axios.config';

const axios = instance;

@binding()
export class AuthSteps {

    baseUrl: string = '/auth';
    accessToken: string;

    // @ts-ignore
    @when(/user makes request/)
    public user_makes_request() {

    }

    // @ts-ignore
    @then(/user receives response/)
    public user_receives_response() {
        return axios.get(this.baseUrl)
            .then(function (respose) {
            })
            .catch(function (error) {
                assertThat(error.response.data.statusCode, is(404))
            });
    }

    // @ts-ignore
    @when(/user creates account with username: "(\w*)" password: "(.*)"/)
    public user_creates_account_with_login_password(username: string, password: string) {
        return axios.post(this.baseUrl + '/signup', {
            username: username,
            password: password
        })
            .then(function (response) {
                assertThat('Wrong response status', response.status, is(201))
                assertThat('Wrong response status text', response.statusText, is('Created'))

            })
            .catch(function (error) {
                assertThat('Error must not be present', error, is(undefined));
            });
    }

    // @ts-ignore
    @then(/user receives token for username: "(\w*)" password: "(.*)"/)
    public user_receives_for_username_password(username: string, password: string) {
        const self = this;
        return axios.post(this.baseUrl + '/signin', {
            username: username,
            password: password
        })
            .then(function (response) {
                self.accessToken = response.data.accessToken;
                assertThat(
                    'Access token not received',
                    response.data.accessToken, hasSize(greaterThan(100)));
            })
            .catch(function (error) {
                assertThat('Error must not be present', error, is(undefined));
            });
    }

    // @ts-ignore
    @after()
    public afterAllScenarios(): Promise<void> {
      if(this.accessToken) {
          return axios.delete(this.baseUrl + '/delete/user', {
              headers: {
                  Authorization: 'Bearer ' + this.accessToken//the token is a variable which holds the token
              }
          })
              .then(function (response) {
              })
              .catch(function (error) {
              })
      }
    }
}
