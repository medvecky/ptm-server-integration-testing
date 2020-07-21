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

