import { connectToDB } from "../db";
import Liability from "../models/liability.model";

async function testLiabilities() {
  try {
    console.log("Connecting to database...");
    await connectToDB();
    console.log("Connected to database successfully");

    // Test data
    const testLiability = {
      userId: "test_user_123",
      name: "Test Credit Card",
      category: "Credit Card",
      amount: 5000,
      currency: "USD",
      institution: "Test Bank",
      accountNumber: "1234",
      dueDate: new Date("2024-12-31"),
      interestRate: 18.99,
      monthlyPayment: 150,
      remainingBalance: 5000,
      originalAmount: 5000,
      notes: "Test liability for development",
      isActive: true,
    };

    console.log("Creating test liability...");
    const createdLiability = await Liability.create(testLiability);
    console.log("Created liability:", createdLiability);

    console.log("Finding liability by ID...");
    const foundLiability = await Liability.findById(createdLiability._id);
    console.log("Found liability:", foundLiability);

    console.log("Updating liability...");
    const updatedLiability = await Liability.findByIdAndUpdate(
      createdLiability._id,
      { amount: 4500, remainingBalance: 4500 },
      { new: true }
    );
    console.log("Updated liability:", updatedLiability);

    console.log("Finding all liabilities for user...");
    const userLiabilities = await Liability.find({ userId: "test_user_123" });
    console.log("User liabilities:", userLiabilities);

    console.log("Deleting test liability...");
    await Liability.findByIdAndDelete(createdLiability._id);
    console.log("Test liability deleted");

    console.log("All tests passed!");
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    process.exit(0);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testLiabilities();
}

export { testLiabilities };
