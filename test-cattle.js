import { prisma } from './lib/db.js';

async function testCattleCreation() {
  try {
    console.log('Testing cattle creation...');
    
    const newCattle = await prisma.cattle.create({
      data: {
        name: 'Test Cow',
        type: 'Cow',
        age: 3,
        purchasePrice: 50000,
        purchaseDate: new Date(),
        status: 'active'
      }
    });
    
    console.log('Created cattle:', newCattle);
    
    const allCattle = await prisma.cattle.findMany();
    console.log('All cattle:', allCattle);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCattleCreation();
