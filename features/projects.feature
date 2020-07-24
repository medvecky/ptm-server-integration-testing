Feature: Projects

  Background:
    Given remove existing user

  Scenario: User can create project
    Given  Given user creates account with username: "alice" password: "PassSword#1919"
    And user receives token for username: "alice" password: "PassSword#1919"
    When user creates project with:
      | title       | Project1             |
      | description | Project1 description |
    Then user by id gets project with following data:
      | title       | Project1             |
      | description | Project1 description |

  Scenario: Unauthorized user gets error when try to create project
    Then user gets error when creates project with:
      | errorCode    | 401          |
      | errorMessage | Unauthorized |

  Scenario: User gets projects list
    Given  Given user creates account with username: "alice" password: "PassSword#1919"
    And user receives token for username: "alice" password: "PassSword#1919"
    When user creates project with:
      | title       | Project1             |
      | description | Project1 description |
    And user creates project with:
      | title       | Project2             |
      | description | Project2 description |
    Then user gets 2 projects
    And user gets project 1 with following data:
      | title       | Project1             |
      | description | Project1 description |
    And user gets project 2 with following data:
      | title       | Project2             |
      | description | Project2 description |

  Scenario: User can filter tasks by title
    Given user creates account with username: "alice" password: "PassSword#1919"
    And user receives token for username: "alice" password: "PassSword#1919"
    And user creates project with:
      | title       | T1 FT1 |
      | description | D1 FC  |
    And user creates project with:
      | title       | T2 FC  |
      | description | D2 FD2 |
    Then user gets 1 project with search filter "FT1"
    And user gets project 1 with search filter: "FT1" with following data:
      | title       | T1 FT1 |
      | description | D1 FC  |

  Scenario: User can filter tasks by description
    Given user creates account with username: "alice" password: "PassSword#1919"
    And user receives token for username: "alice" password: "PassSword#1919"
    And user creates project with:
      | title       | T1 FT1 |
      | description | D1 FC  |
    And user creates project with:
      | title       | T2 FC  |
      | description | D2 FD2 |
    Then user gets 1 project with search filter "FD2"
    And user gets project 1 with search filter: "FD2" with following data:
      | title       | T2 FC  |
      | description | D2 FD2 |

  Scenario: User can filter tasks by title and description
    Given user creates account with username: "alice" password: "PassSword#1919"
    And user receives token for username: "alice" password: "PassSword#1919"
    And user creates project with:
      | title       | T1 FT1 |
      | description | D1 FC  |
    And user creates project with:
      | title       | T2 FC  |
      | description | D2 FD2 |
    Then user gets 2 project with search filter "FC"
    And user gets project 1 with search filter: "FC" with following data:
      | title       | T1 FT1 |
      | description | D1 FC  |
    And user gets project 2 with search filter: "FC" with following data:
      | title       | T2 FC  |
      | description | D2 FD2 |

  Scenario: User deletes all projects
    Given user creates account with username: "alice" password: "PassSword#1919"
    And user receives token for username: "alice" password: "PassSword#1919"
    And user creates project with:
      | title       | T1 FT1 |
      | description | D1 FC  |
    And user creates project with:
      | title       | T2 FC  |
      | description | D2 FD2 |
    When user deletes all projects
    Then user gets 0 projects

  Scenario: User deletes project by id
    Given user creates account with username: "alice" password: "PassSword#1919"
    And user receives token for username: "alice" password: "PassSword#1919"
    And user creates project with:
      | title       | Project1             |
      | description | Project1 description |
    When user deletes project by id
    Then user gets 0 projects

  Scenario: User updates project's title and description
    Given user creates account with username: "alice" password: "PassSword#1919"
    And user receives token for username: "alice" password: "PassSword#1919"
    And user creates project with:
      | title       | Title |
      | description | Desc  |
    When user updates project with:
      | title       | Title edited |
      | description | Desc edited  |
    Then user by id gets project with following data: with following data:
      | title       | Title edited |
      | description | Desc edited  |
      | status      | OPEN         |

