Feature: Tasks

  Background:
    Given remove existing user

  Scenario: User creates task without project
    Given user creates account with username: "alice" password: "PassSword#1919"
    And user receives token for username: "alice" password: "PassSword#1919"
    When user creates task with:
      | title       | Task1             |
      | description | Task1 description |
    Then user by id gets task with following data:
      | title       | Task1             |
      | description | Task1 description |
      | status      | OPEN              |

  Scenario: User creates task with project
    Given user creates account with username: "alice" password: "PassSword#1919"
    And user receives token for username: "alice" password: "PassSword#1919"
    When user creates task with:
      | title       | Task1             |
      | description | Task1 description |
      | projectId   | xxx               |
    Then user by id gets task with following data:
      | title       | Task1             |
      | description | Task1 description |
      | status      | OPEN              |
      | projectId   | xxx               |

  Scenario: Unauthorized user gets error when try to create account
    Then user gets error when creates task with:
      | errorCode    | 401          |
      | errorMessage | Unauthorized |

  Scenario: User gets task by project id
    Given user creates account with username: "alice" password: "PassSword#1919"
    And user receives token for username: "alice" password: "PassSword#1919"
    When user creates task with:
      | title       | Task1             |
      | description | Task1 description |
      | projectId   | xxx               |
    Then user by projectId: "xxx" gets 1 task
    And user by projectId: "xxx" gets task 1 with following data:
      | title       | Task1             |
      | description | Task1 description |
      | status      | OPEN              |
      | projectId   | xxx               |
    And user by projectId: "yyy" gets 0 task

  Scenario: User can get tasks list
    Given user creates account with username: "alice" password: "PassSword#1919"
    And user receives token for username: "alice" password: "PassSword#1919"
    When user creates task with:
      | title       | Task1             |
      | description | Task1 description |
      | projectId   | xxx               |
    And user creates task with:
      | title       | Task2             |
      | description | Task2 description |
      | projectId   | xxx               |
    Then user gets 2 tasks
    And user gets task 1 with following data:
      | title       | Task1             |
      | description | Task1 description |
      | status      | OPEN              |
      | projectId   | xxx               |

  Scenario: User gets empty list if tasks not exists
    Given user creates account with username: "alice" password: "PassSword#1919"
    And user receives token for username: "alice" password: "PassSword#1919"
    Then user gets 0 tasks

  Scenario: User changes task status from OPEN to IN_PROGRESS
    Given user creates account with username: "alice" password: "PassSword#1919"
    And user receives token for username: "alice" password: "PassSword#1919"
    When user creates task with:
      | title       | Task1             |
      | description | Task1 description |
      | projectId   | xxx               |
    And user changes task status to "IN_PROGRESS" with response:
      | title       | Task1             |
      | description | Task1 description |
      | status      | IN_PROGRESS       |
      | projectId   | xxx               |
      | beginDate   | 2020-07-22        |
    Then user by id gets task with following data:
      | title       | Task1             |
      | description | Task1 description |
      | status      | IN_PROGRESS       |
      | projectId   | xxx               |
      | beginDate   | 2020-07-22        |


  Scenario: User changes task status IN_PROGRESS to DONE
    Given user creates account with username: "alice" password: "PassSword#1919"
    And user receives token for username: "alice" password: "PassSword#1919"
    And user creates task with:
      | title       | Task1             |
      | description | Task1 description |
      | projectId   | xxx               |
    And user changes task status to "IN_PROGRESS" with response:
      | title       | Task1             |
      | description | Task1 description |
      | status      | IN_PROGRESS       |
      | projectId   | xxx               |
      | beginDate   | 2020-07-22        |
    When user changes task status to "DONE" with response:
      | title       | Task1             |
      | description | Task1 description |
      | status      | DONE              |
      | projectId   | xxx               |
      | beginDate   | 2020-07-22        |
      | endDate     | 2020-07-22        |
    Then user by id gets task with following data:
      | title       | Task1             |
      | description | Task1 description |
      | status      | DONE              |
      | projectId   | xxx               |
      | beginDate   | 2020-07-22        |
      | endDate     | 2020-07-22        |

  Scenario: User can filter tasks by status
    Given user creates account with username: "alice" password: "PassSword#1919"
    And user receives token for username: "alice" password: "PassSword#1919"
    And user creates task with:
      | title       | Task1             |
      | description | Task1 description |
      | projectId   | xxx               |
    And And user changes task status to "IN_PROGRESS" with response:
      | title       | Task1             |
      | description | Task1 description |
      | status      | IN_PROGRESS       |
      | projectId   | xxx               |
      | beginDate   | 2020-07-22        |
    And user creates task with:
      | title       | Task2             |
      | description | Task2 description |
      | projectId   | xxx               |
    Then user gets 1 task with status filter "IN_PROGRESS"
    And user gets 1 task with status filter "OPEN"
    And user gets 0 tasks with status filter "DONE"
    And user gets task 1 with status filter: "IN_PROGRESS" with following data:
      | title       | Task1             |
      | description | Task1 description |
      | status      | IN_PROGRESS       |
      | projectId   | xxx               |
      | beginDate   | 2020-07-22        |
    And user gets task 1 with status filter: "OPEN" with following data:
      | title       | Task2             |
      | description | Task2 description |
      | status      | OPEN              |
      | projectId   | xxx               |
