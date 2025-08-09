"use server"

import { prisma } from './db'

// Edit Cattle Action
export async function editCattle(id, data) {
  try {
    const cattle = await prisma.cattle.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type,
        age: parseInt(data.age),
        price: parseInt(data.price),
        date: new Date(data.date)
      }
    })
    try {
      revalidatePath('/cattle')
    } catch (e) {
      console.warn('revalidatePath failed but cattle was edited:', e)
    }
    return cattle
  } catch (error) {
    console.error('Error editing cattle:', error)
    throw new Error('Failed to edit cattle')
  }
}

// Delete Staff Action
export async function deleteStaff(id) {
  try {
    await prisma.staff.delete({
      where: { id }
    })
    return { success: true }
  } catch (error) {
    console.error('Error deleting staff:', error)
    throw new Error('Failed to delete staff')
  }
}

// Edit Staff Action
export async function editStaff(id, data) {
  try {
    const staff = await prisma.staff.update({
      where: { id },
      data: {
        name: data.name,
        cnic: data.cnic,
        phone: data.phone,
        salary: data.salary ? parseInt(data.salary) : 0,
        dateOfHiring: data.dateOfHiring ? new Date(data.dateOfHiring) : new Date(),
        status: data.status || 'active'
      }
    })
    return staff
  } catch (error) {
    console.error('Error editing staff:', error)
    throw new Error('Failed to edit staff')
  }
}

// Milk Production Actions
export async function getMilkProductions() {
  try {
    return await prisma.milkProduction.findMany({
      orderBy: { date: 'desc' }
    })
  } catch (error) {
    console.error('Error fetching milk productions:', error)
    throw new Error('Failed to fetch milk productions')
  }
}

// Add Staff Action
export async function addStaff(data) {
  try {
    const staff = await prisma.staff.create({
      data: {
        name: data.name,
        cnic: data.cnic,
        phone: data.phone,
        salary: data.salary ? parseInt(data.salary) : 0,
        dateOfHiring: data.dateOfHiring ? new Date(data.dateOfHiring) : new Date(),
        status: data.status || 'active'
      }
    })
    return staff
  } catch (error) {
    console.error('Error adding staff:', error)
    throw new Error('Failed to add staff')
  }
}

// Cattle Actions
export async function getCattle() {
  try {
    return await prisma.cattle.findMany({
      orderBy: { date: 'desc' }
    })
  } catch (error) {
    console.error('Error fetching cattle:', error)
    throw new Error('Failed to fetch cattle')
  }
}

export async function addCattle(data) {
  let cattle
  try {
    cattle = await prisma.cattle.create({
      data: {
        name: data.name,
        type: data.type,
        age: parseInt(data.age),
        price: parseInt(data.price),
        date: new Date(data.date)
      }
    })
  } catch (error) {
    console.error('Error adding cattle:', error)
    if (error instanceof Error && error.stack) {
      console.error('Stack trace:', error.stack)
    }
    if (error.code) {
      console.error('Prisma error code:', error.code)
    }
    if (error.meta) {
      console.error('Prisma error meta:', error.meta)
    }
    // Log the payload for debugging
    console.error('Cattle payload:', data)
    throw new Error('Failed to add cattle')
  }
  try {
    revalidatePath('/cattle')
  } catch (e) {
    console.warn('revalidatePath failed but cattle was added:', e)
  }
  return cattle
}

export async function removeCattle(cattleId) {
  // RemoveCattle is now a placeholder since status is not in schema
  try {
    // You may want to delete or archive cattle here
    await prisma.cattle.delete({
      where: { id: cattleId }
    })
    revalidatePath('/cattle')
    revalidatePath('/cashflow')
    return { success: true }
  } catch (error) {
    console.error('Error removing cattle:', error)
    throw new Error('Failed to remove cattle')
  }
}

// Transaction Actions
export async function addTransaction(data) {
  try {
    // Helper to clean optional fields
    const clean = (val) => (val === '' || val === undefined ? null : val)
    let amount = data.amount
    // Validation logic based on category/type
    if (!data.transactionName || !data.transactionType || !data.category || !data.date) {
      throw new Error('Missing required transaction fields (name, type, category, date)')
    }
  let milkProductionId = null
  let newCattle = null
    // Milk Sale
    if (data.category === 'milk') {
      if (!data.litres || !data.pricePerLitre || !data.session) {
        throw new Error('Missing required milk sale fields (litres, pricePerLitre, session)')
      }
      // Calculate amount if not provided
      if (!amount || amount === '') {
        const litres = parseInt(data.litres)
        const pricePerLitre = parseInt(data.pricePerLitre)
        amount = (litres && pricePerLitre) ? (litres * pricePerLitre).toString() : '0'
      }
      // Create MilkProduction record
      const milkProduction = await prisma.milkProduction.create({
        data: {
          date: new Date(data.date),
          session: data.session,
          litres: parseInt(data.litres),
          pricePerLitre: parseInt(data.pricePerLitre),
          cattleId: clean(data.selectedCattle)
        }
      })
      milkProductionId = milkProduction.id
    }
    // Sell Cattle
    let shouldDeleteCattle = false;
    if (data.category === 'sell cattle') {
      if (!data.selectedCattle || !data.amount) {
        throw new Error('Missing required sell cattle fields (selectedCattle, amount)')
      }
      shouldDeleteCattle = true;
    }
    // Buy Cattle
    if (data.category === 'buy cattle') {
      if (!data.cattleName || !data.cattleType || !data.cattleAge || !data.amount) {
        throw new Error('Missing required buy cattle fields (cattleName, cattleType, cattleAge, amount)')
      }
      // Add cattle to Cattle table
      newCattle = await prisma.cattle.create({
        data: {
          name: data.cattleName,
          type: data.cattleType,
          age: parseInt(data.cattleAge),
          price: parseInt(data.amount),
          date: new Date(data.date)
        }
      })
    }
    // Other Income/Expense
    if ((data.category === 'other income' || data.category === 'other expense') && !data.amount) {
      throw new Error('Missing required amount for other income/expense')
    }
    // Prepare Prisma payload
    let cattleIdToUse = clean(data.selectedCattle);
    if (data.category === 'buy cattle' && newCattle && newCattle.id) {
      cattleIdToUse = newCattle.id;
    }
    const prismaPayload = {
      name: data.transactionName,
      type: data.transactionType,
      amount: parseInt(amount),
      date: new Date(data.date),
      cattleId: cattleIdToUse,
      staffId: clean(data.selectedStaff),
      milkProductionId: milkProductionId
      // Add more relations if needed
    }
    const transaction = await prisma.transaction.create({ data: prismaPayload })
    // After transaction is created, delete cattle if needed
    if (shouldDeleteCattle && prismaPayload.cattleId) {
      try {
        await prisma.cattle.delete({ where: { id: prismaPayload.cattleId } })
      } catch (e) {
        console.warn('Failed to delete sold cattle:', e)
      }
    }
    try {
      revalidatePath('/cashflow')
    } catch (e) {
      console.warn('revalidatePath failed but transaction was added:', e)
    }
    return transaction
  } catch (error) {
    console.error('Error adding transaction:', error)
    if (error instanceof Error && error.stack) {
      console.error('Stack trace:', error.stack)
    }
    if (error.code) {
      console.error('Prisma error code:', error.code)
    }
    if (error.meta) {
      console.error('Prisma error meta:', error.meta)
    }
    // Log the payload for debugging
    console.error('Transaction payload:', data)
    throw new Error(error.message || 'Failed to add transaction')
  }
}

export async function getTransactions() {
  try {
    return await prisma.transaction.findMany({
      orderBy: { date: 'desc' },
      include: {
        cattle: true,
        staff: true
      }
    })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    throw new Error('Failed to fetch transactions')
  }
}

// Staff Actions
export async function getStaff() {
  try {
    return await prisma.staff.findMany({
      orderBy: { name: 'asc' }
    })
  } catch (error) {
    console.error('Error fetching staff:', error)
    throw new Error('Failed to fetch staff')
  }
}
