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
      | provider | email             | password      | status |
      | native   | serval@gmail.com  | Serval123     |    200 |
      | native   | serval@gmail.com  | Serval1234444 |    403 |
      | native   | serval@gmail.com  | Serval1234444 |    404 |
      | native   | admin@company.com | admin123      |    200 |
      | native   | admin@company.com | admin1223     |    200 |
      | native   | serval@gmail.com  | Serval123     |    200 |
      | native   | serval@gmail.com  | Serval123     |    200 |
      | native   | serval@gmail.com  | Serval123     |    200 |
      | native   | serval@gmail.com  | Serval123     |    200 |
      | native   | serval@gmail.com  | Serval123     |    200 |
      | native   | serval@gmail.com  | Serval123     |    200 |
      | native   | serval@gmail.com  | Serval123     |    200 |
      | native   | serval@gmail.com  | Serval1234444 |    403 |
      | native   | serval@gmail.com  | Serval1234444 |    404 |
      | native   | admin@company.com | admin123      |    200 |
      | native   | admin@company.com | admin1223     |    200 |
      | native   | serval@gmail.com  | Serval123     |    200 |
      | native   | serval@gmail.com  | Serval123     |    200 |
      | native   | serval@gmail.com  | Serval123     |    201 |
      | native   | serval@gmail.com  | Serval123     |    201 |
      | native   | serval@gmail.com  | Serval123     |    201 |
      | native   | serval@gmail.com  | Serval123     |    201 |
      | native   | serval@gmail.com  | Serval123     |    201 |
      | native   | serval@gmail.com  | Serval1234444 |    403 |
      | native   | serval@gmail.com  | Serval1234444 |    404 |
      | native   | admin@company.com | admin123      |    201 |
      | native   | admin@company.com | admin1223     |    201 |
      | native   | serval@gmail.com  | Serval123     |    201 |
      | native   | serval@gmail.com  | Serval123     |    201 |
      | native   | serval@gmail.com  | Serval123     |    201 |
