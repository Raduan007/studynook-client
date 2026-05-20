/**
 * Normalizes a room object from the server shape to the client shape.
 * Server uses: title, price
 * Client uses: name, hourlyRate
 */
export const normalizeRoom = (room) => {
  if (!room) return room
  return {
    ...room,
    // Map server field names to client field names
    name: room.name ?? room.title ?? '',
    hourlyRate: room.hourlyRate ?? room.price ?? 0,
    image: room.image ?? room.imageUrl ?? '',
  }
}
