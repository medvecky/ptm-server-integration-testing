Feature: Auth

  Scenario: User can create account
    When user creates account with username: "alice" password: "PassSword#1919"
    Then user receives token for username: "alice" password: "PassSword#1919"