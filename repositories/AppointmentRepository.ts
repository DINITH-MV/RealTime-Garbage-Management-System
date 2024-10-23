// repositories/AppointmentRepository.ts

import { db } from "../lib/db"; // Assuming db is your Prisma client instance

type AppointmentData = {
  id?: number;
  userId: string;
  location: string;
  type: string;
  description: string;
  date?: Date; // Optional
  paymentStatus?: string; // Default is "pending"
};

export default class AppointmentRepository {
  // Create a new appointment
  async createAppointment(data: AppointmentData) {
    try {
      const newAppointment = await db.appointment.create({
        data: {
          location: data.location,
          userId: data.userId,
          type: data.type,
          description: data.description,
          date: data.date || new Date(), // If no date is provided, use the current date
          paymentStatus: data.paymentStatus || "pending", // Default to "pending" if not provided
        },
      });
      return newAppointment;
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw new Error("Error creating appointment");
    }
  }

  // Fetch all appointments
  async getAllAppointments() {
    try {
      const appointments = await db.appointment.findMany();
      return appointments;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw new Error("Error fetching appointments");
    }
  }

  // Fetch a specific appointment by ID
  async getAppointmentById(id: number) {
    try {
      const appointment = await db.appointment.findUnique({
        where: { id },
      });
      return appointment;
    } catch (error) {
      console.error("Error fetching appointment:", error);
      throw new Error("Error fetching appointment");
    }
  }

  // Update an existing appointment
  async updateAppointment(id: number, data: Partial<AppointmentData>) {
    try {
      const updatedAppointment = await db.appointment.update({
        where: { id },
        data,
      });
      return updatedAppointment;
    } catch (error) {
      console.error("Error updating appointment:", error);
      throw new Error("Error updating appointment");
    }
  }

  // Delete an appointment by ID
  async deleteAppointment(id: number) {
    try {
      const deletedAppointment = await db.appointment.delete({
        where: { id },
      });
      return deletedAppointment;
    } catch (error) {
      console.error("Error deleting appointment:", error);
      throw new Error("Error deleting appointment");
    }
  }
}
