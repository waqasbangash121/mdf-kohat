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
    const updateData = {
      name: data.name,
      type: data.type,
      age: parseInt(data.age)
    };
    
    // Only update price and date if provided
    if (data.purchasePrice || data.price) {
      updateData.purchasePrice = parseInt(data.purchasePrice || data.price);
    }
    if (data.purchaseDate || data.date) {
      updateData.purchaseDate = new Date(data.purchaseDate || data.date);
    }
    if (data.status) {
      updateData.status = data.status;
    }

    const cattle = await prisma.cattle.update({
      where: { id },
      data: updateData
    });
    
    revalidatePath('/cattle');
    revalidatePath('/cashflow');
    return cattle;
  } catch (error) {
    console.error('Error updating cattle:', error);
    throw new Error('Failed to update cattle');
  }
}

export async function deleteCattle(id) {
  try {
    // First check if cattle has any associated transactions
    const transactionCount = await prisma.transaction.count({
      where: { cattleId: id }
    });

    if (transactionCount > 0) {
      // If there are transactions, just mark as deleted/sold instead of actual deletion
      const cattle = await prisma.cattle.update({
        where: { id },
        data: { status: 'deleted' }
      });
      
      revalidatePath('/cattle');
      revalidatePath('/cashflow');
      return cattle;
    } else {
      // If no transactions, safe to delete completely
      await prisma.cattle.delete({
        where: { id }
      });
      
      revalidatePath('/cattle');
      revalidatePath('/cashflow');
      return { success: true };
    }
  } catch (error) {
    console.error('Error deleting cattle:', error);
    throw new Error('Failed to delete cattle');
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

export async function deleteStaff(id) {
  try {
    await prisma.staff.delete({
      where: { id }
    });
    
    revalidatePath('/staff');
    revalidatePath('/cashflow');
    return { success: true };
  } catch (error) {
    console.error('Error deleting staff:', error);
    throw new Error('Failed to delete staff');
  }
}

// Aliases for compatibility with existing code
export const editStaff = updateStaff;
export const editCattle = updateCattle;

// TRANSACTION MANAGEMENT
export async function getTransactions() {
  try {
    return await prisma.transaction.findMany({ 
      orderBy: [
        { date: 'desc' },
        { createdAt: 'desc' }
      ],
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

    // Use a transaction to ensure both operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      let cattleId = data.cattleId || null;

      // If this is a cattle purchase, create the cattle first
      if (data.category === 'cattle_purchase' && data.cattleName) {
        const newCattle = await tx.cattle.create({
          data: {
            name: data.cattleName,
            type: data.cattleType,
            age: parseInt(data.cattleAge),
            purchasePrice: amount,
            purchaseDate: new Date(data.date),
            status: 'active'
          }
        });
        cattleId = newCattle.id;
        
        // Add cattle details to transaction details
        details.cattleDetails = {
          name: data.cattleName,
          type: data.cattleType,
          age: parseInt(data.cattleAge)
        };
      }

      // Create the transaction record
      const transaction = await tx.transaction.create({
        data: {
          name: data.name,
          type: data.type,
          category: data.category,
          amount: amount,
          date: new Date(data.date),
          details: Object.keys(details).length > 0 ? details : null,
          cattleId: cattleId,
          staffId: data.staffId || null
        },
        include: {
          cattle: true,
          staff: true
        }
      });

      // If this is a cattle sale, mark the cattle as sold
      if (data.category === 'cattle_sales' && data.cattleId) {
        await tx.cattle.update({
          where: { id: data.cattleId },
          data: { status: 'sold' }
        });
      }

      return transaction;
    });
    
    revalidatePath('/cashflow');
    revalidatePath('/cattle'); // Also revalidate cattle page to reflect status change
    return result;
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
