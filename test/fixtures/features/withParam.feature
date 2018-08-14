Feature: A parametrized step

    Cucumber js should pass argument into reporter

    Scenario: A parametrized scenario
        Given Step has DataTable parameter
            |some|table|
            |passed|into|
        And Step has DocString parameter
            """
            some data here
            """
