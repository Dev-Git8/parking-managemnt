const prisma = require('../src/config/prisma');

async function main() {
    console.log('--- Businesses ---');
    try {
        const businesses = await prisma.business.findMany();
        console.log(JSON.stringify(businesses, null, 2));
    } catch (err) {
        console.error('Error fetching businesses:', err.message);
    }

    console.log('\n--- Slots ---');
    try {
        const slots = await prisma.slot.findMany();
        console.log(JSON.stringify(slots, null, 2));
    } catch (err) {
        console.error('Error fetching slots:', err.message);
    }

    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
