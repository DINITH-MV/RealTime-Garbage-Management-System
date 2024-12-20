"use client";

// Define the Appointment interface
interface Appointment {
  id: string;
  userId: string;
  location: string;
  type: string;
  description: string;
  date?: string;
  paymentStatus?: string; // Add this line
}

import { useState, useEffect } from "react";

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="bg-gray-600 fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
      <div className="relative w-full max-w-[380px] rounded-lg bg-white p-6  shadow-lg">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 absolute right-2 top-2"
        >
          <i
            className="fa-duotone fa-solid fa-circle-xmark mr-[10px] mt-[5px] text-[20pt]"
            style={
              {
                "--fa-primary-color": "#fff",
                "--fa-secondary-color": "#ff4141",
                "--fa-secondary-opacity": "1",
              } as React.CSSProperties
            }
          ></i>
        </button>
        {children}
      </div>
    </div>
  );
}

import { useRouter } from "next/navigation";

function AddManagement({
  onSubmit,
  userId,
}: {
  onSubmit: () => void;
  userId: string;
}) {
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // To store validation errors

  const router = useRouter();

  // Validation Logic
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!location) newErrors.location = "Location is required.";
    if (!type) newErrors.type = "Type is required.";
    if (!description) newErrors.description = "Description is required.";

    if (!date) {
      newErrors.date = "Date is required.";
    } else {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set the time to 0 to compare only dates
      if (selectedDate < today) {
        newErrors.date = "You cannot book an appointment for a past date.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
      return; // Do not submit the form if there are validation errors
    }

    try {
      const res = await fetch("/api/Appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, location, type, date, description }),
      });

      if (res.ok) {
        onSubmit();
      } else {
        throw new Error("Failed to add Appointment");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePayment = () => {
    if (!validateForm()) {
      return; // Do not submit the form if there are validation errors
    }

    router.push("/user/payment");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex flex-col">
        <label className="text-gray-700 mb-2 font-semibold" htmlFor="location">
          Location
        </label>
        <input
          id="location"
          type="text"
          className="border-gray-300 rounded-md border px-4 py-2"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        {errors.location && (
          <p className="text-[#d13333]">{errors.location}</p>
        )}
      </div>
      <div className="flex flex-col">
        <label className="text-gray-700 mb-2 font-semibold" htmlFor="type">
          Type
        </label>
        <select
          id="type"
          className="border-gray-300 rounded-md border px-4 py-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="" disabled>
            Select type
          </option>
          <option value="eco">ECO</option>
          <option value="plastic">Plastic</option>
          <option value="papers">Paper</option>
          {/* Add more options as needed */}
        </select>
        {errors.type && <p className="text-[#d13333]">{errors.type}</p>}
      </div>
      <div className="flex flex-col">
        <label className="text-gray-700 mb-2 font-semibold" htmlFor="date">
          Date
        </label>
        <input
          id="date"
          type="date"
          className="border-gray-300 rounded-md border px-4 py-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {errors.date && <p className="text-[#d13333]">{errors.date}</p>}
      </div>
      <div className="flex flex-col">
        <label
          className="text-gray-700 mb-2 font-semibold"
          htmlFor="description"
        >
          Address
        </label>
        <textarea
          id="description"
          className="border-gray-300 rounded-md border px-4 py-2"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && (
          <p className="text-[#d13333]">{errors.description}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-[#ea8c44] px-6 py-3 font-bold text-white"
      >
        Do payment later
      </button>
      <button
        type="button"
        className="w-full rounded-md bg-[#fa4b34] px-6 py-3 font-bold text-white"
        onClick={handlePayment}
      >
        Make payment
      </button>
    </form>
  );
}


// Edit Appointment Form (EditAppointmentForm)
function EditAppointmentForm({
  id,
  location,
  type,
  description,
  date,
  onSubmit,
}: {
  id: string;
  location: string;
  type: string;
  description: string;
  date: string;
  onSubmit: () => void;
}) {
  const [newLocation, setNewLocation] = useState(location);
  const [newType, setNewType] = useState(type);
  const [newDescription, setNewDescription] = useState(description);
  const [newDate, setNewDate] = useState(
    date ? new Date(date).toISOString().split("T")[0] : "",
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/Appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: newLocation,
          type: newType,
          description: newDescription,
          date: newDate,
        }),
      });

      if (res.ok) {
        onSubmit();
      } else {
        throw new Error("Failed to update Appointment");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex flex-col">
        <label className="text-gray-700 mb-2 font-semibold" htmlFor="location">
          Location
        </label>
        <input
          id="location"
          type="text"
          className="border-gray-300 rounded-md border px-4 py-2"
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
        />
      </div>
      <div className="flex flex-col">
        <label className="text-gray-700 mb-2 font-semibold" htmlFor="type">
          Type
        </label>
        <select
          id="type"
          className="border-gray-300 rounded-md border px-4 py-2"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
        >
          <option value="" disabled>
            Select type
          </option>
          <option value="eco">ECO</option>
          <option value="plastic">Plastic</option>
          <option value="papers">Paper</option>
          {/* Add more options as needed */}
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-gray-700 mb-2 font-semibold" htmlFor="date">
          Date
        </label>
        <input
          id="date"
          type="date"
          className="border-gray-300 rounded-md border px-4 py-2"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />
      </div>
      <div className="flex flex-col">
        <label
          className="text-gray-700 mb-2 font-semibold"
          htmlFor="description"
        >
          Address
        </label>
        <textarea
          id="description"
          className="border-gray-300 rounded-md border px-4 py-2"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-[#c89434] px-6 py-3 font-bold text-white"
      >
        Update Appointment
      </button>
    </form>
  );
}

interface ManagementAppointmentProps {
  userId: string | null | undefined;
}

// ManagementAppointment Component
const ManagementAppointment: React.FC<ManagementAppointmentProps> = ({
  userId,
}) => {
  const [Appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [shouldRefresh, setShouldRefresh] = useState(false); // Add this state to trigger refresh

  console.log(userId);

  // Fetch Appointments from the API
  const getAppointments = async () => {
    try {
      const res = await fetch("/api/Appointments", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch Appointments");
      }

      const data = await res.json();
      setAppointments(data.Appointments || []);
    } catch (error) {
      console.error("Error loading Appointments: ", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Appointments when the component mounts
  useEffect(() => {
    getAppointments();
  }, [shouldRefresh]);

  // Function to handle deleting a Appointment
  const deleteAppointment = async (id: string) => {
    try {
      const res = await fetch(`/api/Appointments/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        getAppointments(); // Refresh the Appointments after deletion
      } else {
        throw new Error("Failed to delete Appointment");
      }
    } catch (error) {
      console.error("Error deleting Appointment: ", error);
    }
  };

  // Handle Add Appointment Modal
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  // Handle Edit Appointment Modal
  const openEditModal = (Appointment: Appointment) => {
    setSelectedAppointment(Appointment);
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedAppointment(null);
    setShouldRefresh((prev) => !prev); // Trigger refresh after modal is closed
  };

  if (loading) {
    return (
      <p className="text-gray-600 text-center text-lg font-semibold">
        Loading...
      </p>
    );
  }

  return (
    <div className="mx-auto mt-10 max-w-6xl px-4">
      {/* Button to open Add Appointment modal */}
      <button
        onClick={openAddModal}
        className="rounded-[7pt] bg-[#c89434] px-4 py-4 text-[20px] font-bold text-white transition-colors hover:bg-[#e0c098]"
      >
        Add Appointment
      </button>

      {Appointments.length === 0 ? (
  <p className="text-gray-600 text-center text-lg font-semibold">
    No Appointments available.
  </p>
) : (
  <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Appointments
      .filter((t) => t.userId === userId) // Filter by userId
      .map((t) => (
        <div
          key={t.id}
          className="border-gray-300 flex flex-col justify-between gap-4 rounded-lg border-[2px] border-white bg-[#fbeabb] p-4 shadow-lg"
        >
          <div>
            <div className="flex justify-between">
              <h2 className="text-gray-800 text-[17pt] font-bold">
                {t.type}
              </h2>
              <p className="text-gray-600 mt-[5px] text-[13pt]">
                Payment:
                <span className="text-[#ea3636]"> {t.paymentStatus}</span>
              </p>
            </div>
            <p className="text-gray-600 mt-[10px] text-[13pt]">
              Location: {t.location}
            </p>
            <p className="text-gray-600 mt-[5px] text-[13pt]">
              Due Date:
              {t.date
                ? new Date(t.date).toLocaleDateString()
                : "Date not available"}
            </p>
            <p className="text-gray-600 mt-[5px] text-[13pt]">
              Type: {t.type}
            </p>
            <p className="text-gray-600 mt-[5px] text-[13pt]">
              Address: {t.description}
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              className="font-bold text-blue-600 hover:text-blue-800"
              onClick={() => openEditModal(t)}
            >
              Edit
            </button>
            <button
              className="hover:text-red-800 font-bold text-[#d22121]"
              onClick={() => deleteAppointment(t.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
  </div>
)}


      {/* Modal for Add Appointment */}
      <Modal isOpen={isAddModalOpen} onClose={closeModal}>
        {userId ? (
          <AddManagement onSubmit={closeModal} userId={userId} />
        ) : (
          <p className="text-red-500">User need to login.</p>
        )}
      </Modal>

      {/* Modal for Edit Appointment */}
      {selectedAppointment && (
        <Modal isOpen={isEditModalOpen} onClose={closeModal}>
          <EditAppointmentForm
            id={selectedAppointment.id}
            location={selectedAppointment.location}
            type={selectedAppointment.type}
            description={selectedAppointment.description}
            date={selectedAppointment.date || ""}
            onSubmit={closeModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default ManagementAppointment;
