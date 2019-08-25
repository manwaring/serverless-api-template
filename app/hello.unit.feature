Feature: Saying hello

Scenario: The hello message is returned
  Given an http request
  When the hello handler is invoked
  Then the hello message is returned
