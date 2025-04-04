package karate.payment;

import com.intuit.karate.junit5.Karate;

public class PaymentTest {
    @Karate.Test
    Karate testPaymentApi() {
        return Karate.run("payment-api").relativeTo(getClass());
    }
}