import { render, screen, fireEvent } from "@testing-library/react";
import AreaManagement from "../AreaManagement"; // Adjust this import based on your file structure
import "@testing-library/jest-dom";
import toast from "react-hot-toast"; // Mock toast
import fetchMock from "jest-fetch-mock";

// Mock fetch and toast for the test
beforeAll(() => {
  fetchMock.enableMocks(); // Enable fetch mocking
});

beforeEach(() => {
  fetchMock.resetMocks(); // Reset fetch mocks between tests
  jest.clearAllMocks(); // Clear mocks between tests
});

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe("AreaManagement POST method", () => {
  it("should submit the form and call fetch with correct data", async () => {
    // Mock locations prop
    const locations: { city: string; apiUrl: string; marker: string; latitude: number; longitude: number; binId: string; createdAt: string }[] = [];

    // Render the AreaManagement component
    render(<AreaManagement locations={locations} />);

    // Open the modal
    fireEvent.click(screen.getByText("NEW LOCATION"));

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText("Eg: Kaluthara"), {
      target: { value: "Kaluthara" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(
        "Ex: https://sgp1.blynk.cloud/external/api/get?token=R9UM..."
      ),
      { target: { value: "https://example.com/api" } }
    );
    fireEvent.change(screen.getByPlaceholderText("Eg: #ff0000"), {
      target: { value: "#ff0000" },
    });
    fireEvent.change(screen.getByPlaceholderText("Eg: 8.9585"), {
      target: { value: "8.9585" },
    });
    fireEvent.change(screen.getByPlaceholderText("Eg: 65.8612"), {
      target: { value: "65.8612" },
    });

    // Mock successful POST request
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }), {
      status: 200,
    });

    // Submit the form
    fireEvent.click(screen.getByText("Add a Place"));

    // Wait for fetch to be called
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("/api/Area-Management", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        city: "Kaluthara",
        apiUrl: "https://example.com/api",
        marker: "#ff0000",
        latitude: 8.9585,
        longitude: 65.8612,
      }),
    });

    // Check if the success toast is called
    expect(toast.success).toHaveBeenCalledWith("Location added!");

    // Check if modal is closed (indicating success)
    expect(screen.queryByPlaceholderText("Eg: Kaluthara")).not.toBeInTheDocument();
  });

  it("should show an error if validation fails", async () => {
    // Render the AreaManagement component
    render(<AreaManagement locations={[]} />);

    // Open the modal
    fireEvent.click(screen.getByText("NEW LOCATION"));

    // Submit the form without filling in the fields
    fireEvent.click(screen.getByText("Add a Place"));

    // Expect validation errors to be shown
    expect(screen.getByText("City is required.")).toBeInTheDocument();
    expect(screen.getByText("Blynk key is required.")).toBeInTheDocument();
    expect(screen.getByText("Marker color is required.")).toBeInTheDocument();
    expect(screen.getByText("Latitude is required.")).toBeInTheDocument();
    expect(screen.getByText("Longitude is required.")).toBeInTheDocument();

    // Ensure fetch is not called
    expect(fetch).not.toHaveBeenCalled();
  });
});
