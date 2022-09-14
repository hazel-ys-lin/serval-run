Feature: Profile
user to check their user infomation

  @profile
  Scenario Outline: user profile
    Given I am an signed in <provider> user
    And In browser I have <withCredentials>
    And I have session ID <sid> stored
    When I press profile
    Then the result should be <status> on the screen

    Examples: 
      | provider | withCredentials | sid                                                                                        | status |
      | native   | true            | s%3Ao8zhZrhpqnK2Uv5u5XZ8Rtl6M7v7sjXW.51UN49PceH7KIZOPV%2Bt04%2FiE1TOa7Jm%2BMH%2BAT%2BKaUEc |    200 |
      | native   | false           | s%3Ao8zhZrhpqnK2Uv5u5XZ8Rtl6M7v7sjXW.51UN49PceH7KIZOPV%2Bt04%2FiE1TOa7Jm%2BMH%2BAT%2BKaUEc |    200 |
      | native   | false           |                                                                                            |    403 |
      | native   | false           | s%3Ao8zhZrhpqnK2Uv5u5XZ8Rtl6M7v7sjXW.51UN49PceH7KIZOPV%2Bt04%2FiE1TOa7Jm%2BMH%2BAT%2BKaUEc |    200 |
      | native   | true            |                                                                                            |    403 |
