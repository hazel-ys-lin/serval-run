Feature: Sign in
user system to make user sign in

  @signin
  Scenario Outline: user sign in
    Given I am an existing <provider> user
    And I have entered <email> in the form
    And I have entered <password> into the form
    When I press signin
    Then the result should be <status> on the screen

    Examples: 
      | provider | email         | password   | status |
      | native   | abf@gmail.com | abdddddddd |    200 |
      | native   |           123 |        123 |    403 |
