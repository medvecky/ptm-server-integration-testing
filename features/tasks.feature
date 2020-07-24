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

  Scenario: Unauthorized user gets error when try to create task
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
      | beginDate   | defined           |
    Then user by id gets task with following data:
      | title       | Task1             |
      | description | Task1 description |
      | status      | IN_PROGRESS       |
      | projectId   | xxx               |
      | beginDate   | defined           |


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
      | beginDate   | defined           |
      | endDate     | defined           |
    Then user by id gets task with following data:
      | title       | Task1             |
      | description | Task1 description |
      | status      | DONE              |
      | projectId   | xxx               |
      | beginDate   | defined           |
      | endDate     | defined           |

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
      | beginDate   | defined           |
    And user gets task 1 with status filter: "OPEN" with following data:
      | title       | Task2             |
      | description | Task2 description |
      | status      | OPEN              |
      | projectId   | xxx               |

  Scenario: User can filter tasks by title
    Given user creates account with username: "alice" password: "PassSword#1919"
    And user receives token for username: "alice" password: "PassSword#1919"
    And user creates task with:
      | title       | T1 FT1 |
      | description | D1 FC  |
    And user creates task with:
      | title       | T2 FC  |
      | description | D2 FD2 |
    Then user gets 1 task with search filter "FT1"
    And user gets task 1 with search filter: "FT1" with following data:
      | title       | T1 FT1 |
      | description | D1 FC  |
      | status      | OPEN   |

  Scenario: User can filter tasks by description
    Given user creates account with username: "alice" password: "PassSword#1919"
    And user receives token for username: "alice" password: "PassSword#1919"
    And user creates task with:
      | title       | T1 FT1 |
      | description | D1 FC  |
    And user creates task with:
      | title       | T2 FC  |
      | description | D2 FD2 |
    Then user gets 1 task with search filter "FD2"
    And user gets task 1 with search filter: "FD2" with following data:
      | title       | T2 FC  |
      | description | D2 FD2 |
      | status      | OPEN   |

  Scenario: User can filter tasks by title and description
    Given user creates account with username: "alice" password: "PassSword#1919"
    And user receives token for username: "alice" password: "PassSword#1919"
    And user creates task with:
      | title       | T1 FT1 |
      | description | D1 FC  |
    And user creates task with:
      | title       | T2 FC  |
      | description | D2 FD2 |
    Then user gets 2 task with search filter "FC"
    And user gets task 1 with search filter: "FC" with following data:
      | title       | T1 FT1 |
      | description | D1 FC  |
      | status      | OPEN   |
    And user gets task 2 with search filter: "FC" with following data:
      | title       | T2 FC  |
      | description | D2 FD2 |
      | status      | OPEN   |

  Scenario: User deletes all tasks
    Given user creates account with username: "alice" password: "PassSword#1919"
    And user receives token for username: "alice" password: "PassSword#1919"
    And user creates task with:
      | title       | T1 FT1 |
      | description | D1 FC  |
    And user creates task with:
      | title       | T2 FC  |
      | description | D2 FD2 |
    When user deletes all tasks
    Then user gets 0 tasks

  Scenario: User deletes tasks by project id
    Given user creates account with username: "alice" password: "PassSword#1919"
    And user receives token for username: "alice" password: "PassSword#1919"
    And user creates task with:
      | title       | T1 FT1 |
      | description | D1 FC  |
      | projectId   | xxx    |
    And user creates task with:
      | title       | T2 FC  |
      | description | D2 FD2 |
      | projectId   | yyy    |
    When user deletes tasks by project id: "xxx"
    Then user gets 1 tasks
    And user gets task 1 with following data:
      | title       | T2 FC  |
      | description | D2 FD2 |
      | status      | OPEN   |
      | projectId   | yyy    |

  Scenario: User deletes project from tasks
    Given user creates account with username: "alice" password: "PassSword#1919"
    And user receives token for username: "alice" password: "PassSword#1919"
    And user creates task with:
      | title       | T1 FT1 |
      | description | D1 FC  |
      | projectId   | xxx    |
    And user creates task with:
      | title       | T2 FC  |
      | description | D2 FD2 |
      | projectId   | xxx    |
    And user creates task with:
      | title       | T3  |
      | description | D3  |
      | projectId   | yyy |
    When user deletes project: "xxx" from tasks
    Then user by projectId: "xxx" gets 0 task
    And user by projectId: "yyy" gets 1 task
    And user by projectId: "yyy" gets task 1 with following data:
      | title       | T3   |
      | description | D3   |
      | status      | OPEN |
      | projectId   | yyy  |
    Then user gets 1 task with search filter "FT1"
    And user gets task 1 with search filter: "FT1" with following data:
      | title       | T1 FT1 |
      | description | D1 FC  |
      | status      | OPEN   |

  Scenario: User deletes task by id
    Given user creates account with username: "alice" password: "PassSword#1919"
    And user receives token for username: "alice" password: "PassSword#1919"
    And user creates task with:
      | title       | Task1             |
      | description | Task1 description |
    When user deletes task by id
    Then user gets 0 tasks

  Scenario: User updates task's title and description
    Given user creates account with username: "alice" password: "PassSword#1919"
    And user receives token for username: "alice" password: "PassSword#1919"
    And user creates task with:
      | title       | Title |
      | description | Desc  |
    When user updates task with:
      | title       | Title edited |
      | description | Desc edited  |
    Then user by id gets task with following data:
      | title       | Title edited |
      | description | Desc edited  |
      | status      | OPEN         |

  Scenario: User can puts and deletes project from task
    Given user creates account with username: "alice" password: "PassSword#1919"
    And user receives token for username: "alice" password: "PassSword#1919"
    And user creates task with:
      | title       | Title |
      | description | Desc  |
    When user puts projectId: "xxx" to task
    Then user by id gets task with following data:
      | title       | Title |
      | description | Desc  |
      | status      | OPEN  |
      | projectId   | xxx   |
    When user deletes projectId from task
    Then user by id gets task with following data:
      | title       | Title |
      | description | Desc  |
      | status      | OPEN  |