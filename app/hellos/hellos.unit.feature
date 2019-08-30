Feature: Saying hello

Scenario: Adding a hello message
  Given a valid add hello request
  When the add hello handler is invoked
  Then the hello message is returned
