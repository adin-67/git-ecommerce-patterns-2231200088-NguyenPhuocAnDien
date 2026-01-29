import { InventoryService } from '../../services/InventoryService.js';
import { PaymentService } from '../../services/PaymentService.js';
import { ShippingService } from '../../services/ShippingService.js';

class CheckoutFacade {
    constructor() {
        this.inventoryService = new InventoryService();
        this.paymentService = new PaymentService();
        this.shippingService = new ShippingService();
    }

    placeOrder(orderDetails) {
        // TODO: Implement the Facade method.
        // This method should orchestrate the calls to the subsystem services
        // in the correct order to simplify the checkout process.  
        console.log(`Starting order placement for user: ${orderDetails.userId}`);
        // 1. Check if all products are in stock using `inventoryService.checkStock()`.
        const isStockAvailable = this.inventoryService.checkStock(orderDetails.productIds);

        if (!isStockAvailable) {
            console.log("Order failed: Some products are out of stock.");
            return;
        }
        console.log("Step 1: Inventory check passed.");
        // 2. If they are, process the payment using `paymentService.processPayment()`.
        const paymentSuccessful = this.paymentService.processPayment(orderDetails.userId, orderDetails.amount || 0);

        if (!paymentSuccessful) {
            console.log("Order failed: Payment processed unsuccessfully.");
            return;
        }
        console.log("Step 2: Payment successful.");
        // 3. If payment is successful, arrange shipping using `shippingService.arrangeShipping()`.
        // 4. Log the result of each step. If a step fails, log it and stop.

        const shippingTracking = this.shippingService.arrangeShipping(orderDetails.shippingInfo);

        if (shippingTracking) {
            console.log(`Step 3: Shipping arranged. Tracking ID: ${shippingTracking}`);
            console.log("SUCCESS: Order has been placed successfully!");
        } else {
            console.log("Order failed: Could not arrange shipping.");
        }
    }
}

export { CheckoutFacade };