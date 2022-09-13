Feature: Product category
showing products of each category

  @category
  Scenario Outline: product category
    Given I input <category> in url
    And I have entered <paging> in url
    When I send request to the url
    Then the result should be <status> on the screen

    Examples: 
      | category    | paging | status |
      | men         |      1 |    200 |
      | men         |    100 |    200 |
      | women       |      2 |    404 |
      | women       |      2 |    200 |
      | accessories |     -1 |    404 |
      | toy         |      1 |    404 |
