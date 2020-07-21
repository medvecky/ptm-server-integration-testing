Feature: Auth

  Background:
    Given remove existing user

  Scenario: User can create account
    When user creates account with username: "alice" password: "PassSword#1919"
    Then user receives token for username: "alice" password: "PassSword#1919"

  Scenario: User can't create account with weak password
    Then User gets following error when creates account with username: "alice" password: "passw":
      | errorCode    | 400                                                                     |
      | errorType    | Bad Request                                                             |
      | errorMessage | Password too weak,password must be longer than or equal to 8 characters |

  Scenario: User can't create account with short username and weak password
    Then User gets following error when creates account with username: "bob" password: "PassSword#1919":
      | errorCode    | 400                                                   |
      | errorType    | Bad Request                                           |
      | errorMessage | username must be longer than or equal to 4 characters |

  Scenario: User can't create a profile with an already existing name
    Given user creates account with username: "alice" password: "PassSword#1919"
    And user receives token for username: "alice" password: "PassSword#1919"
    Then User gets following error when creates account with username: "alice" password: "PassSword#1919":
      | errorCode    | 409                     |
      | errorType    | Conflict                |
      | errorMessage | username already exists |

  Scenario: User gets error if try to login with wrong username
    Given user creates account with username: "alice" password: "PassSword#1919"
    And user receives token for username: "alice" password: "PassSword#1919"
    Then User gets following error when login with username: "robert" password: "PassSword#1919":
      | errorCode    | 401                 |
      | errorType    | Unauthorized        |
      | errorMessage | Invalid credentials |

  Scenario: User gets error if try to login with wrong password
    Given user creates account with username: "alice" password: "PassSword#1919"
    And user receives token for username: "alice" password: "PassSword#1919"
    Then User gets following error when login with username: "alice" password: "PassSword#1915":
      | errorCode    | 401                 |
      | errorType    | Unauthorized        |
      | errorMessage | Invalid credentials |

  Scenario: User can delete profile without authorization
    Then User gets following error when try to delete user without valid token:
      | errorCode    | 401          |
      | errorMessage | Unauthorized |