import instance from './axios.config';
import {SharedContext} from "./sahred-context";
import {binding, then, when} from "cucumber-tsflow/dist";
import {assertThat, defined, is} from "hamjest";

const axios = instance;

@binding([SharedContext])
export class TasksSteps {
    constructor(protected context: SharedContext) {
    }

    baseUrl: string = '/projects';

    // @ts-ignore
    @when(/user creates project with:/)
    public user_creates_project_with(projectDataTable) {
        const project = projectDataTable.rowsHash();
        const self = this;
        return axios.post(this.baseUrl, {
            title: project.title,
            description: project.description
        }, {
            headers: {
                Authorization: 'Bearer ' + this.context.accessToken
            }
        })
            .then(function (response) {
                assertThat('Wrong status', response.status, is(201));
                assertThat('Wrong status text', response.statusText, is('Created'));
                assertThat('Wrong title', response.data.title, is(project.title));
                assertThat('Wrong description', response.data.description, is(project.description));
                assertThat('Undefined id', response.data.id, defined());
                assertThat('Undefined userId', response.data.userId, defined());
                self.context.projectId = response.data.id;
            })
            .catch(function (error) {
                assertThat('Error must not be present', error, is(undefined));
            });
    }

    // @ts-ignore
    @then(/user by id gets project with following data:/)
    public user_by_id_gets_project_with_following_data(expectedProjectDataTable) {
        return axios.get(this.baseUrl + `/${this.context.projectId}`, {
            headers: {
                Authorization: 'Bearer ' + this.context.accessToken
            }
        })
            .then(function (response) {
                const expectedProject = expectedProjectDataTable.rowsHash();
                assertThat('Wrong status', response.status, is(200));
                assertThat('Wrong status text', response.statusText, is('OK'));
                assertThat('Wrong title', response.data.title, is(expectedProject.title));
                assertThat('Wrong description', response.data.description, is(expectedProject.description));
                assertThat('Undefined id', response.data.id, defined());
                assertThat('Undefined userId', response.data.userId, defined());
            })
            .catch(function (error) {
                assertThat('Error must not be present', error, is(undefined))
            });
    }

    // @ts-ignore
    @then(/user gets error when creates project with:/)
    public user_gets_error_when_creates_project(expectedErrorDataTable) {
        return axios.post(this.baseUrl, {
            title: 'Test',
            description: 'Test'
        }, {
            headers: {
                Authorization: 'Bearer xxx'
            }
        })
            .then(function (response) {
                assertThat('Response must not be present', response, is(undefined))
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
    @then(/^user gets (\d+) projects?$/)
    public user_gets_n_projects(expectedNumberOfProjects: number) {
        return axios.get(this.baseUrl, {
            headers: {
                Authorization: 'Bearer ' + this.context.accessToken
            }
        })
            .then(function (response) {
                assertThat('Wrong status', response.status, is(200));
                assertThat('Wrong status text', response.statusText, is('OK'));
                assertThat('Tasks not exists', response.data, defined());
                assertThat('Wrong number of tasks', response.data.length, is(expectedNumberOfProjects));
            })
            .catch(function (error) {
                assertThat('Error must not be present', error, is(undefined));
            });
    }

    // @ts-ignore
    @then(/^user gets project (\d+) with following data:$/)
    public user_gets_project_n_with_following_data(projectNumber: number, expectedProjectDataTable) {
        return axios.get(this.baseUrl, {
            headers: {
                Authorization: 'Bearer ' + this.context.accessToken
            }
        })
            .then(function (response) {
                assertThat('Wrong status', response.status, is(200));
                assertThat('Wrong status text', response.statusText, is('OK'));
                assertThat('Tasks not exists', response.data[projectNumber - 1], defined());

                const task = response.data[projectNumber - 1];
                const expectedProject = expectedProjectDataTable.rowsHash();

                assertThat('Wrong title', task.title, is(expectedProject.title));
                assertThat('Wrong description', task.description, is(expectedProject.description));
                assertThat('Undefined id', task.id, defined());
                assertThat('Undefined userId', task.userId, defined());
            })
            .catch(function (error) {
                assertThat('Error must not be present', error, is(undefined));
            });
    }

    // @ts-ignore
    @then(/^user gets (\d+) projects? with search filter "(.*)"$/)
    public user_gets_n_projects_with_search_filter(expectedNumberOfProjects: number, searchFilter: string) {
        return axios.get(this.baseUrl, {
            headers: {
                Authorization: 'Bearer ' + this.context.accessToken
            },
            params: {
                search: searchFilter
            }
        })
            .then(function (response) {
                assertThat('Wrong status', response.status, is(200));
                assertThat('Wrong status text', response.statusText, is('OK'));
                assertThat('Tasks not exists', response.data, defined());
                assertThat('Wrong number of tasks', response.data.length, is(expectedNumberOfProjects))
            })
            .catch(function (error) {
                assertThat('Error must not be present', error, is(undefined));
            })
    }

    // @ts-ignore
    @then(/^user gets project (\d+) with search filter: "(.*)" with following data:$/)
    public user_gets_project_n_with_search_filter_with_following_data(
        projectNumber: number,
        searchFilter: string,
        expectedTaskDataTable) {
        return axios.get(this.baseUrl, {
            headers: {
                Authorization: 'Bearer ' + this.context.accessToken
            },
            params: {
                search: searchFilter
            }
        })
            .then(function (response) {
                assertThat('Wrong status', response.status, is(200));
                assertThat('Wrong status text', response.statusText, is('OK'));
                assertThat('Tasks not exists', response.data[projectNumber - 1], defined());

                const project = response.data[projectNumber - 1];
                const expectedTask = expectedTaskDataTable.rowsHash();

                assertThat('Wrong title', project.title, is(expectedTask.title));
                assertThat('Wrong description', project.description, is(expectedTask.description));
                assertThat('Undefined id', project.id, defined());
                assertThat('Undefined userId', project.userId, defined());

            })
            .catch(function (error) {
                assertThat('Error must not be present', error, is(undefined));
            });
    }

    // @ts-ignore
    @when(/user deletes all projects/)
    public user_deletes_all_projects() {
        return axios.delete(this.baseUrl + '/all', {
            headers: {
                Authorization: 'Bearer ' + this.context.accessToken
            }
        })
            .then(function (response) {
                assertThat('Wrong status', response.status, is(200));
                assertThat('Wrong status text', response.statusText, is('OK'));
            })
            .catch(function (error) {
                assertThat('Error must not be present', error, is(undefined));
            });
    }

    // @ts-ignore
    @when(/user deletes project by id/)
    public user_deletes_project_by_id() {
        return axios.delete(this.baseUrl + `/${this.context.projectId}`, {
            headers: {
                Authorization: 'Bearer ' + this.context.accessToken
            }
        })
            .then(function (response) {
                assertThat('Wrong status', response.status, is(200));
                assertThat('Wrong status text', response.statusText, is('OK'));
            })
            .catch(function (error) {
                assertThat('Error must not be present', error, is(undefined));
            });
    }

    // @ts-ignore
    @when(/user updates project with:/)
    public user_updates_project_with(updateDataTable) {
        const update = updateDataTable.rowsHash();
        return axios.patch(
            this.baseUrl + `/${this.context.projectId}`,
            {
                title: update.title,
                description: update.description
            },
            {
                headers: {
                    Authorization: 'Bearer ' + this.context.accessToken
                }
            })
            .then(function (response) {
                assertThat('Wrong status', response.status, is(200));
                assertThat('Wrong status text', response.statusText, is('OK'));
            })
            .catch(function (error) {
                assertThat('Error must not be present', error, is(undefined));
            });
    }
}
