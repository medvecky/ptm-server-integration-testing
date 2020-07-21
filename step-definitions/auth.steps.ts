import {after, binding, given, then, when} from "cucumber-tsflow/dist";
import {assertThat, greaterThan, hasSize, is, not} from "hamjest";
import instance from './axios.config';
import {SharedContext} from "./sahred-context";

const axios = instance;

@binding([SharedContext])
export class AuthSteps {

    baseUrl: string = '/auth';

    constructor(protected context: SharedContext) {
    }

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
                self.context.accessToken = response.data.accessToken;
                assertThat(
                    'Access token not received',
                    response.data.accessToken, hasSize(greaterThan(100)));
            })
            .catch(function (error) {
                assertThat('Error must not be present', error, is(undefined));
            });
    }

    // @ts-ignore
    @then(/User gets following error when creates account with username: "(\w*)" password: "(.*)":/)
    public user_gets_error_when_creates_account_with_username_password(username: string, password: string, expectedErrorDataTable) {
        return axios.post(this.baseUrl + '/signup', {
            username: username,
            password: password
        })
            .then(function (response) {
                assertThat('Response must not be present', response, is(undefined));

            })
            .catch(function (error) {
                const expectedError = expectedErrorDataTable.rowsHash();
                const errorData = error.response.data;
                assertThat('Wrong error code', errorData.statusCode, is(Number(expectedError.errorCode)));
                assertThat('Wrong error message', errorData.message.toString(), is(expectedError.errorMessage));
                assertThat('Wrong error type', errorData.error, is(expectedError.errorType));
            });
    }

    // @ts-ignore
    @then(/User gets following error when login with username: "(\w*)" password: "(.*)":/)
    public user_gets_error_when_login_with_username_password(username: string, password: string, expectedErrorDataTable) {
        return axios.post(this.baseUrl + '/signin', {
            username: username,
            password: password
        })
            .then(function (response) {
                assertThat('Response must not be present', response, is(undefined));

            })
            .catch(function (error) {
                const expectedError = expectedErrorDataTable.rowsHash();
                const errorData = error.response.data;
                assertThat('Wrong error code', errorData.statusCode, is(Number(expectedError.errorCode)));
                assertThat('Wrong error message', errorData.message.toString(), is(expectedError.errorMessage));
                assertThat('Wrong error type', errorData.error, is(expectedError.errorType));
            });
    }

    // @ts-ignore
    @then(/User gets following error when try to delete user without valid token:/)
    public user_gets_error_when_try_to_delete_account_without_token(expectedErrorDataTable) {
        return axios.delete(this.baseUrl + '/delete/user', {
            headers: {
                Authorization: 'Bearer xxx'//the token is a variable which holds the token
            }
        })
            .then(function (response) {
                assertThat('Response must not be present', response, is(undefined));

            })
            .catch(function (error) {
                const expectedError = expectedErrorDataTable.rowsHash();
                const errorData = error.response.data;
                assertThat('Wrong error code', errorData.statusCode, is(Number(expectedError.errorCode)));
                assertThat('Wrong error message', errorData.message.toString(), is(expectedError.errorMessage));
                assertThat('Wrong error type', errorData.error, is(expectedError.errorType));
            });
    }

    // @ts-ignore
    @given(/remove existing user/)
    public remove_existing_user(): Promise<void> {
        return this.afterAllScenarios();
    }

    // @ts-ignore
    @after()
    public afterAllScenarios(): Promise<void> {
        if (this.context.accessToken) {
            axios.delete('/tasks/all', {
                headers: {
                    Authorization: 'Bearer ' + this.context.accessToken//the token is a variable which holds the token
                }
            })
                .then(function (response) {
                })
                .catch(function (error) {
                });

            return axios.delete(this.baseUrl + '/delete/user', {
                headers: {
                    Authorization: 'Bearer ' + this.context.accessToken//the token is a variable which holds the token
                }
            })
                .then(function (response) {
                })
                .catch(function (error) {
                });
        }
    }
}
