Feature: User
user system to make user sign up and sign in

  @signup
  Scenario Outline: new user sign up
    Given I am <provider> user
    And I have entered <name> in the form
    And I have entered <email> in the form
    And I have entered <password> into the form
    When I press signup
    Then the result should be <status> on the screen

    Examples: 
      | provider | name | email         | password   | status |
      | native   | abd  | abf@gmail.com | abdddddddd |    201 |
      | native   |  123 |           123 |        123 |    403 |
