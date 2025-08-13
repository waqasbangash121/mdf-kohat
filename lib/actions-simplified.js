"use server"

import { prisma } from './db'
import { revalidatePath } from 'next/cache'

// CATTLE MANAGEMENT
export async function getCattle() {
  try {
    return await prisma.cattle.findMany({ 
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { transactions: true }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching cattle:', error);
    throw new Error('Failed to fetch cattle');
  }
}

export async function addCattle(data) {
  try {
    const cattle = await prisma.cattle.create({
      data: {
        name: data.name,
        type: data.type,
        age: parseInt(data.age),
        purchasePrice: parseInt(data.purchasePrice),
        purchaseDate: new Date(data.purchaseDate),
        status: 'active'
      }
    });
    
    revalidatePath('/cattle');
    revalidatePath('/cashflow');
    return cattle;
  } catch (error) {
    console.error('Error adding cattle:', error);
    throw new Error('Failed to add cattle');
  }
}

export async function updateCattle(id, data) {
  try {
    const cattle = await prisma.cattle.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type,
        age: parseInt(data.age),
        status: data.status
      }
    });
    
    revalidatePath('/cattle');
    revalidatePath('/cashflow');
    return cattle;
  } catch (error) {
    console.error('Error updating cattle:', error);
    throw new Error('Failed to update cattle');
  }
}

// STAFF MANAGEMENT
export async function getStaff() {
  try {
    return await prisma.staff.findMany({ 
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { transactions: true }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching staff:', error);
    throw new Error('Failed to fetch staff');
  }
}

export async function addStaff(data) {
  try {
    const staff = await prisma.staff.create({
      data: {
        name: data.name,
        cnic: data.cnic,
        phone: data.phone,
        salary: parseInt(data.salary),
        dateOfHiring: new Date(data.dateOfHiring),
        status: 'active'
      }
    });
    
    revalidatePath('/staff');
    revalidatePath('/cashflow');
    return staff;
  } catch (error) {
    console.error('Error adding staff:', error);
    throw new Error('Failed to add staff');
  }
}

export async function updateStaff(id, data) {
  try {
    const staff = await prisma.staff.update({
      where: { id },
      data: {
        name: data.name,
        cnic: data.cnic,
        phone: data.phone,
        salary: parseInt(data.salary),
        status: data.status
      }
    });
    
    revalidatePath('/staff');
    revalidatePath('/cashflow');
    return staff;
  } catch (error) {
    console.error('Error updating staff:', error);
    throw new Error('Failed to update staff');
  }
}

// TRANSACTION MANAGEMENT
export async function getTransactions() {
  try {
    return await prisma.transaction.findMany({ 
      orderBy: { date: 'desc' },
      include: {
        cattle: true,
        staff: true
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw new Error('Failed to fetch transactions');
  }
}

export async function addTransaction(data) {
  try {
    // Calculate amount based on transaction type
    let amount = 0;
    let details = {};
    
    if (data.category === 'milk_sales') {
      // For milk sales, calculate from litres and price
      amount = parseInt(data.litres) * parseInt(data.pricePerLitre);
      details = {
        litres: parseInt(data.litres),
        pricePerLitre: parseInt(data.pricePerLitre),
        session: data.session
      };
    } else {
      // For other transactions, use provided amount
      amount = parseInt(data.amount);
      if (data.description) {
        details.description = data.description;
      }
    }

    const transaction = await prisma.transaction.create({
      data: {
        name: data.name,
        type: data.type,
        category: data.category,
        amount: amount,
        date: new Date(data.date),
        details: Object.keys(details).length > 0 ? details : null,
        cattleId: data.cattleId || null,
        staffId: data.staffId || null
      },
      include: {
        cattle: true,
        staff: true
      }
    });
    
    revalidatePath('/cashflow');
    return transaction;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw new Error('Failed to add transaction');
  }
}

export async function updateTransaction(id, data) {
  try {
    // Calculate amount based on transaction type
    let amount = 0;
    let details = {};
    
    if (data.category === 'milk_sales') {
      amount = parseInt(data.litres) * parseInt(data.pricePerLitre);
      details = {
        litres: parseInt(data.litres),
        pricePerLitre: parseInt(data.pricePerLitre),
        session: data.session
      };
    } else {
      amount = parseInt(data.amount);
      if (data.description) {
        details.description = data.description;
      }
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type,
        category: data.category,
        amount: amount,
        date: new Date(data.date),
        details: Object.keys(details).length > 0 ? details : null,
        cattleId: data.cattleId || null,
        staffId: data.staffId || null
      },
      include: {
        cattle: true,
        staff: true
      }
    });
    
    revalidatePath('/cashflow');
    return transaction;
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw new Error('Failed to update transaction');
  }
}

export async function deleteTransaction(id) {
  try {
    await prisma.transaction.delete({
      where: { id }
    });
    
    revalidatePath('/cashflow');
    return { success: true };
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw new Error('Failed to delete transaction');
  }
}

// ANALYTICS HELPERS
export async function getDashboardStats() {
  try {
    const [
      totalCattle,
      activeCattle,
      totalStaff,
      activeStaff,
      totalIncome,
      totalExpenses,
      recentTransactions
    ] = await Promise.all([
      prisma.cattle.count(),
      prisma.cattle.count({ where: { status: 'active' } }),
      prisma.staff.count(),
      prisma.staff.count({ where: { status: 'active' } }),
      prisma.transaction.aggregate({
        where: { type: 'income' },
        _sum: { amount: true }
      }),
      prisma.transaction.aggregate({
        where: { type: 'expense' },
        _sum: { amount: true }
      }),
      prisma.transaction.findMany({
        take: 5,
        orderBy: { date: 'desc' },
        include: { cattle: true, staff: true }
      })
    ]);

    return {
      cattle: { total: totalCattle, active: activeCattle },
      staff: { total: totalStaff, active: activeStaff },
      income: totalIncome._sum.amount || 0,
      expenses: totalExpenses._sum.amount || 0,
      netProfit: (totalIncome._sum.amount || 0) - (totalExpenses._sum.amount || 0),
      recentTransactions
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw new Error('Failed to fetch dashboard stats');
  }
}
