Feature: Validate Payment API Idempotency

  Background:
    * url 'https://api.payment-service.com/v1/payments'
    * header Authorization = 'Bearer ' + karate.properties['test.token']
    * configure logPrettyResponse = true

  Scenario: Verify idempotency - Repeated requests with the same idempotency key do not create duplicate transactions
    Given path '/create-payment'
    And request { "amount": 100, "currency": "USD", "idempotencyKey": "unique-key-123" }
    When method post
    Then status 201
    And match response == { "status": "success", "transactionId": "#string" }

    # Send the same request again to verify idempotency
    When method post
    Then status 200
    And match response == { "status": "success", "message": "Transaction already processed", "transactionId": "#string" }

  Scenario: Verify behavior without idempotency protection (error scenario)
    Given path '/create-payment'
    And request { "amount": 50, "currency": "EUR" } # Missing idempotencyKey
    When method post
    Then status 201
    And match response == { "status": "success", "transactionId": "#string" }

    # Repeated request creates a duplicate transaction
    When method post
    Then status 201
    And match response != { "status": "success", "message": "Transaction already processed" }

  Scenario: Verify GDPR data masking in payment response
    Given path '/create-payment'
    And request
    """
    {
      "amount": 1000,
      "currency": "EUR",
      "idempotencyKey": "gdpr-test-key",
      "customerDetails": {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phone": "+1234567890",
        "address": "123 Privacy Street"
      },
      "paymentMethod": {
        "type": "card",
        "cardNumber": "4111111111111111",
        "expiryDate": "12/25",
        "cvv": "123"
      }
    }
    """
    When method post
    Then status 201
    # Verify sensitive data is masked in response
    And match response.customerDetails.email == '#regex [^@]+@.+'
    And match response.customerDetails.phone == '#regex \\*+\\d{4}'
    And match response.paymentMethod.cardNumber == '#regex \\*+\\d{4}'
    And match response.paymentMethod.cvv == '#regex \\*+'
    # Verify timestamps are properly formatted and masked
    And match response.timestamp == '#regex \\d{4}-\\d{2}-\\d{2}T\\*\\*:\\*\\*:\\*\\*Z'
    # Verify personal data is masked in response logs
    * def responseLog = karate.prevRequest.response
    And match responseLog.customerDetails.name == '#regex \\*+ \\*+'
    And match responseLog.customerDetails.address == '#regex \\*+'