import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting single role verification...");

    const hashedPassword = await bcrypt.hash("password123", 10);

    // 1. Test Mobile System
    console.log("\n--- Testing Mobile System ---");
    const mobileUser = await prisma.mobileUser.create({
        data: {
            email: "mobile_single@test.com",
            name: "Mobile Single Tester",
            passwordHash: hashedPassword,
            isVerified: true,
            role: "CUSTOMER", // Single value
        },
    });

    console.log("Created Mobile User:", {
        id: mobileUser.id,
        email: mobileUser.email,
        role: mobileUser.role,
    });

    if (typeof mobileUser.role === "string" && mobileUser.role === "CUSTOMER") {
        console.log("✅ Mobile role is correctly a single string.");
    } else {
        console.error("❌ Mobile role is NOT a single string.");
    }

    // 2. Test Standard System
    console.log("\n--- Testing Standard System ---");
    const standardUser = await prisma.user.create({
        data: {
            email: "standard_single@test.com",
            name: "Standard Single Tester",
            passwordHash: hashedPassword,
            isVerified: true,
            role: "SYSTEM_OWNER", // Single value
        },
    });

    console.log("Created Standard User:", {
        id: standardUser.id,
        email: standardUser.email,
        role: standardUser.role,
    });

    if (typeof standardUser.role === "string" && standardUser.role === "SYSTEM_OWNER") {
        console.log("✅ Standard role is correctly a single string.");
    } else {
        console.error("❌ Standard role is NOT a single string.");
    }

    console.log("\nVerification complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
