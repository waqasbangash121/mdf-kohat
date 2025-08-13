import { prisma } from '../lib/db.js'

async function seedDatabase() {
  console.log('🌱 Seeding database with sample data...')

  try {
    // Add sample cattle
    const cattle1 = await prisma.cattle.create({
      data: {
        name: 'Goru-1',
        type: 'Cow',
        age: 3,
        purchasePrice: 80000,
        purchaseDate: new Date('2024-01-15'),
        status: 'active'
      }
    })

    const cattle2 = await prisma.cattle.create({
      data: {
        name: 'Buffalo-1',
        type: 'Buffalo',
        age: 4,
        purchasePrice: 120000,
        purchaseDate: new Date('2024-02-10'),
        status: 'active'
      }
    })

    // Add sample staff
    const staff1 = await prisma.staff.create({
      data: {
        name: 'Ahmed Khan',
        cnic: '12345-6789012-3',
        phone: '+92-300-1234567',
        salary: 30000,
        dateOfHiring: new Date('2024-01-01'),
        status: 'active'
      }
    })

    const staff2 = await prisma.staff.create({
      data: {
        name: 'Ali Hassan',
        cnic: '98765-4321098-7',
        phone: '+92-301-9876543',
        salary: 25000,
        dateOfHiring: new Date('2024-03-01'),
        status: 'active'
      }
    })

    // Add sample transactions
    await prisma.transaction.createMany({
      data: [
        // Income transactions
        {
          name: 'Morning Milk Sales',
          type: 'income',
          category: 'milk_sales',
          amount: 4500, // 30 litres × 150 PKR
          date: new Date('2025-08-10'),
          details: {
            litres: 30,
            pricePerLitre: 150,
            session: 'morning'
          }
        },
        {
          name: 'Evening Milk Sales',
          type: 'income',
          category: 'milk_sales',
          amount: 3600, // 24 litres × 150 PKR
          date: new Date('2025-08-10'),
          details: {
            litres: 24,
            pricePerLitre: 150,
            session: 'evening'
          }
        },
        {
          name: 'Sold Old Cow',
          type: 'income',
          category: 'cattle_sales',
          amount: 75000,
          date: new Date('2025-08-05'),
          cattleId: cattle1.id,
          details: {
            description: 'Sold to local buyer'
          }
        },
        // Expense transactions
        {
          name: 'Cattle Feed Purchase',
          type: 'expense',
          category: 'cattle_food',
          amount: 8500,
          date: new Date('2025-08-12'),
          details: {
            description: 'Monthly feed for all cattle'
          }
        },
        {
          name: 'Staff Salary - Ahmed',
          type: 'expense',
          category: 'staff_salary',
          amount: 30000,
          date: new Date('2025-08-01'),
          staffId: staff1.id,
          details: {
            description: 'Monthly salary for August'
          }
        },
        {
          name: 'Fuel for Transportation',
          type: 'expense',
          category: 'fuel_expense',
          amount: 3500,
          date: new Date('2025-08-11'),
          details: {
            description: 'Fuel for milk delivery'
          }
        }
      ]
    })

    console.log('✅ Database seeded successfully!')
    console.log('Sample data created:')
    console.log('- 2 Cattle records')
    console.log('- 2 Staff members')
    console.log('- 6 Transaction records')
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedDatabase()
