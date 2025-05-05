import prisma from './prisma.js'

// Get all vehicles with violations
export async function getVehicles() {
  try {
    return await prisma.vehicle.findMany({
      include: { violations: true },
    })
  } catch (e) {
    throw new Error('Failed to fetch vehicles')
  }
}

// Create a new vehicle
export async function createVehicle(data) {
  try {
    if (!data.plate || !data.owner) {
      throw new Error('Plate and owner are required')
    }

    return await prisma.vehicle.create({ data })
  } catch (e) {
    if (e.code === 'P2002') {
      throw new Error('Plate number already exists')
    }
    throw new Error('Failed to create vehicle')
  }
}

// Update a vehicle (optional)
export async function updateVehicle(id, data) {
  try {
    return await prisma.vehicle.update({
      where: { id },
      data,
    })
  } catch {
    throw new Error('Failed to update vehicle')
  }
}

// Delete a vehicle
export async function deleteVehicle(id) {
  try {
    return await prisma.vehicle.delete({
      where: { id },
    })
  } catch {
    throw new Error('Failed to delete vehicle (may have linked violations)')
  }
}
