export function mapAppointment(appointment) {
  return {
    appointmentId: appointment.appointmentId ?? appointment.AppointmentId,
    petId: appointment.petId ?? appointment.PetId,
    petName: appointment.petName ?? appointment.PetName ?? "",
    species: appointment.species ?? appointment.Species ?? "",
    breed: appointment.breed ?? appointment.Breed ?? "",
    petImageUrl: appointment.petImageUrl ?? appointment.PetImageUrl ?? null,
    ownerName: appointment.ownerName ?? appointment.OwnerName ?? "",
    appointmentDate: appointment.appointmentDate ?? appointment.AppointmentDate,
    status: appointment.status ?? appointment.Status ?? "",
    reason: appointment.reason ?? appointment.Reason ?? "",
    timeDisplay: appointment.timeDisplay ?? appointment.TimeDisplay ?? "",
  };
}
