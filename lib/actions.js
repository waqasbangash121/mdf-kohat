"use server"

import { prisma } from './db'

export async function addMilkProduction(data) {
  try {
    const res = await fetch('/api/milk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to add milk production');
    return await res.json();
  } catch (error) {
    console.error('Error adding milk production:', error);
    throw new Error('Failed to add milk production');
  }
}


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
    return await prisma.milkProduction.findMany({ orderBy: { date: 'desc' } });
  } catch (error) {
    console.error('Error fetching milk productions:', error);
    throw new Error('Failed to fetch milk productions');
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
    return await prisma.cattle.findMany({ orderBy: { name: 'asc' } });
  } catch (error) {
    console.error('Error fetching cattle:', error);
    throw new Error('Failed to fetch cattle');
  }
}

export async function addCattle(data) {
  try {
    const res = await fetch(`${baseUrl}/api/cattle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to add cattle');
    return await res.json();
  } catch (error) {
    console.error('Error adding cattle:', error);
    throw new Error('Failed to add cattle');
  }
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
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to add transaction');
    return await res.json();
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw new Error('Failed to add transaction');
  }
}

export async function getTransactions() {
  try {
    return await prisma.transaction.findMany({ orderBy: { date: 'desc' } });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw new Error('Failed to fetch transactions');
  }
}
