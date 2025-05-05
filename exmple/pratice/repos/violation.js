import prisma from './prisma.js'

// Add violation to a vehicle
export async function addViolation(vehicleId, data) {
  try {
    return await prisma.violation.create({
      data: {
        ...data,
        vehicleId,
        date: new Date(data.date),
      },
    })
  } catch {
    throw new Error('Failed to add violation')
  }
}

// Update violation (e.g., mark as paid)
export async function updateViolation(vehicleId, id, data) {
  try {
    return await prisma.violation.update({
      where: { id },
      data,
    })
  } catch {
    throw new Error('Failed to update violation')
  }
}

// Delete violation (only if paid)
export async function deleteViolation(vehicleId, id) {
  try {
    const violation = await prisma.violation.findUnique({ where: { id } })
    if (!violation) throw new Error('Violation not found')
    if (!violation.paid) throw new Error('Cannot delete an unpaid violation')

    return await prisma.violation.delete({ where: { id } })
  } catch (e) {
    throw new Error(e.message || 'Failed to delete violation')
  }
}
