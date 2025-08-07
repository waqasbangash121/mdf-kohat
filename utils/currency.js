/**
 * Utility functions for currency formatting in Pakistani Rupees (PKR)
 */

/**
 * Format amount in Pakistani Rupees (PKR)
 * @param {number} amount - The amount to format
 * @param {boolean} showDecimals - Whether to show decimal places (default: false)
 * @returns {string} - Formatted currency string
 */
export const formatPKR = (amount, showDecimals = false) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount)
}

/**
 * Format amount in compact PKR format (e.g., ₨1.2M, ₨3.4K)
 * @param {number} amount - The amount to format
 * @returns {string} - Compact formatted currency string
 */
export const formatPKRCompact = (amount) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount)
}

/**
 * Format amount in Pakistani number system (lakh, crore)
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted amount with lakh/crore notation
 */
export const formatPakistaniNumber = (amount) => {
  if (amount >= 10000000) { // 1 crore
    const crores = amount / 10000000
    const formatted = crores % 1 === 0 ? crores.toFixed(0) : crores.toFixed(1)
    return `₨${formatted} ${formatted === '1' ? 'crore' : 'crores'}`
  } else if (amount >= 100000) { // 1 lakh
    const lakhs = amount / 100000
    const formatted = lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)
    return `₨${formatted} ${formatted === '1' ? 'lakh' : 'lakhs'}`
  } else if (amount >= 1000) { // 1 thousand
    const thousands = amount / 1000
    const formatted = thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)
    return `₨${formatted} thousand`
  } else {
    return `₨${amount.toLocaleString('en-PK')}`
  }
}

/**
 * Format amount in natural language (primary function for display)
 * @param {number} amount - The amount to format
 * @returns {string} - Natural language formatted currency
 */
export const formatPKRNatural = (amount) => {
  return formatPakistaniNumber(amount)
}

/**
 * Parse PKR string back to number
 * @param {string} pkrString - PKR formatted string
 * @returns {number} - Parsed number value
 */
export const parsePKR = (pkrString) => {
  // Remove currency symbol and commas, then parse
  return parseFloat(pkrString.replace(/[₨,\s]/g, ''))
} 