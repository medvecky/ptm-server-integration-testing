import {binding, then, when} from "cucumber-tsflow/dist";
import instance from './axios.config';
import {SharedContext} from "./sahred-context";
import {assertThat, defined, is} from "hamjest";

const axios = instance;

@binding([SharedContext])
export class TasksSteps {
    constructor(protected context: SharedContext) {
    }

    baseUrl: string = '/tasks';

    // @ts-ignore
    @when(/user creates task with:/)
    public user_creates_task_with(taskDataTable) {
        const task = taskDataTable.rowsHash();

        if (task.projectId) {
            return this.user_creates_task_with_title_description_project(task.title, task.description, task.projectId);
        } else {
            return this.user_creates_task_with_title_description(task.title, task.description);
        }
    }

    // @ts-ignore
    @then(/user gets error when creates task with:/)
    public user_gets_error_when_creates_task(expectedErrorDataTable) {
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


    public user_creates_task_with_title_description(title: string, description: string) {
        const self = this;
        return axios.post(this.baseUrl, {
            title: title,
            description: description
        }, {
            headers: {
                Authorization: 'Bearer ' + this.context.accessToken
            }
        })
            .then(function (response) {
                assertThat('Wrong status', response.status, is(201));
                assertThat('Wrong status text', response.statusText, is('Created'));
                assertThat('Wrong title', response.data.title, is(title));
                assertThat('Wrong description', response.data.description, is(description));
                assertThat('Wrong status', response.data.status, is('OPEN'));
                assertThat('Undefined id', response.data.id, defined());
                assertThat('Undefined userId', response.data.userId, defined());
                self.context.taskId = response.data.id;
            })
            .catch(function (error) {
                assertThat('Error must not be present', error, is(undefined))
            });

    }


    public user_creates_task_with_title_description_project(title: string, description: string, projectId) {
        const self = this;
        return axios.post(this.baseUrl, {
            title: title,
            description: description,
            projectId: projectId
        }, {
            headers: {
                Authorization: 'Bearer ' + this.context.accessToken
            }
        })
            .then(function (response) {
                assertThat('Wrong status', response.status, is(201));
                assertThat('Wrong status text', response.statusText, is('Created'));
                assertThat('Wrong title', response.data.title, is(title));
                assertThat('Wrong description', response.data.description, is(description));
                assertThat('Wrong status', response.data.status, is('OPEN'));
                assertThat('Undefined projectId', response.data.projectId, projectId);
                assertThat('Undefined id', response.data.id, defined());
                assertThat('Undefined userId', response.data.userId, defined());
                self.context.taskId = response.data.id;
            })
            .catch(function (error) {
                assertThat('Error must not be present', error, is(undefined))
            });

    }

    // @ts-ignore
    @then(/user by id gets task with following data:/)
    public user_by_id_gets_tas_with_following_data(expectedTaskDataTable) {
        return axios.get(this.baseUrl + `/${this.context.taskId}`, {
            headers: {
                Authorization: 'Bearer ' + this.context.accessToken
            }
        })
            .then(function (response) {
                const expectedTask = expectedTaskDataTable.rowsHash();
                assertThat('Wrong status', response.status, is(200));
                assertThat('Wrong status text', response.statusText, is('OK'));
                assertThat('Wrong title', response.data.title, is(expectedTask.title));
                assertThat('Wrong description', response.data.description, is(expectedTask.description));
                assertThat('Wrong task status', response.data.status, is(expectedTask.status));
                assertThat('Undefined id', response.data.id, defined());
                assertThat('Undefined userId', response.data.userId, defined());
                assertThat('Wrong projectId', response.data.projectId, is(expectedTask.projectId));
            })
            .catch(function (error) {
                assertThat('Error must not be present', error, is(undefined))
            });
    }

    // @ts-ignore
    @then(/user by projectId: "(.*)" gets (\d+) tasks?/)
    public user_by_project_id_gets_n_tasks(projectId: string, expectedNumberOfTasks: number) {
        return axios.get(this.baseUrl + `/${projectId}/project`, {
            headers: {
                Authorization: 'Bearer ' + this.context.accessToken
            }
        })
            .then(function (response) {
                assertThat('Wrong status', response.status, is(200));
                assertThat('Wrong status text', response.statusText, is('OK'));
                assertThat('Wrong nnumber of tasks', response.data.length, is(expectedNumberOfTasks))
            })
            .catch(function (error) {
                assertThat('Error must not be present', error, is(undefined))
            });
    }

    // @ts-ignore
    @then(/user by projectId: "(.*)" gets task (\d+) with following data:/)
    public user_by_project_id_gets_n_task_with_param(projectId: string, taskNumber: number, expectedTaskDataTable) {
        return axios.get(this.baseUrl + `/${projectId}/project`, {
            headers: {
                Authorization: 'Bearer ' + this.context.accessToken
            }
        })
            .then(function (response) {
                assertThat('Wrong status', response.status, is(200));
                assertThat('Wrong status text', response.statusText, is('OK'));
                assertThat('Task not exists', response.data[taskNumber - 1], defined());

                const task = response.data[taskNumber - 1];
                const expectedTask = expectedTaskDataTable.rowsHash();

                assertThat('Wrong title', task.title, is(expectedTask.title));
                assertThat('Wrong description', task.description, is(expectedTask.description));
                assertThat('Wrong task status', task.status, is(expectedTask.status));
                assertThat('Undefined id', task.id, defined());
                assertThat('Undefined userId', task.userId, defined());
                assertThat('Wrong projectId', task.projectId, is(expectedTask.projectId));

            })
            .catch(function (error) {
                assertThat('Error must not be present', error, is(undefined));
            });
    }

    // @ts-ignore
    @then(/user gets (\d+) tasks/)
    public user_gets_n_tasks(expectedNumberOfTasks: number) {
        return axios.get(this.baseUrl, {
            headers: {
                Authorization: 'Bearer ' + this.context.accessToken
            }
        })
            .then(function (response) {
                assertThat('Wrong status', response.status, is(200));
                assertThat('Wrong status text', response.statusText, is('OK'));
                assertThat('Tasks not exists', response.data, defined());
                assertThat('Wrong number of tasks', response.data.length, is(expectedNumberOfTasks));
            })
            .catch(function (error) {
                assertThat('Error must not be present', error, is(undefined));
            });
    }

    // @ts-ignore
    @then(/user gets task (\d+) with following data:/)
    public user_gets_task_n_with_following_data(taskNumber: number, expectedTaskDataTable) {
        return axios.get(this.baseUrl, {
            headers: {
                Authorization: 'Bearer ' + this.context.accessToken
            }
        })
            .then(function (response) {
                assertThat('Wrong status', response.status, is(200));
                assertThat('Wrong status text', response.statusText, is('OK'));
                assertThat('Tasks not exists', response.data[taskNumber - 1], defined());

                const task = response.data[taskNumber - 1];
                const expectedTask = expectedTaskDataTable.rowsHash();

                assertThat('Wrong title', task.title, is(expectedTask.title));
                assertThat('Wrong description', task.description, is(expectedTask.description));
                assertThat('Wrong task status', task.status, is(expectedTask.status));
                assertThat('Undefined id', task.id, defined());
                assertThat('Undefined userId', task.userId, defined());
                assertThat('Wrong projectId', task.projectId, is(expectedTask.projectId));

            })
            .catch(function (error) {
                assertThat('Error must not be present', error, is(undefined));
            });
    }
}
