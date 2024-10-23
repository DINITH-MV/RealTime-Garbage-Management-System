import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
import ManagementAppointment from '../ManageAppointment';

// Enable fetch mock
beforeAll(() => {
  fetchMock.enableMocks();
});

beforeEach(() => {
  fetchMock.resetMocks();
});

describe('ManagementAppointment', () => {
  it('should fetch and display appointments', async () => {
    // Mock API response for fetching appointments
    fetchMock.mockResponseOnce(
      JSON.stringify({
        Appointments: [
          {
            id: '1',
            userId: '123',
            location: 'New York',
            type: 'Eco',
            description: 'Recycle program',
            date: '2024-12-15',
            paymentStatus: 'Paid',
          },
        ],
      })
    );

    // Render the component
    render(<ManagementAppointment userId="123" />);

    // Check that the loading text is present
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for the appointments to be fetched and displayed
    await waitFor(() => expect(screen.getByText('Eco')).toBeInTheDocument());

    // Check that appointment details are correctly displayed
    expect(screen.getByText('Recycle program')).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('12/15/2024')).toBeInTheDocument();
    expect(screen.getByText('Paid')).toBeInTheDocument();
  });

  it('should open the add appointment modal', async () => {
    // Mock empty API response
    fetchMock.mockResponseOnce(JSON.stringify({ Appointments: [] }));

    // Render the component
    render(<ManagementAppointment userId="123" />);

    // Wait for the initial state
    await waitFor(() => expect(screen.queryByText('No Appointments available.')).toBeInTheDocument());

    // Click the "Add Appointment" button
    fireEvent.click(screen.getByText('Add Appointment'));

    // Check if the modal opens with the form
    await waitFor(() => {
      expect(screen.getByText('Location')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter location')).toBeInTheDocument();
    });

    // Fill out the form and submit
    fireEvent.change(screen.getByPlaceholderText('Enter location'), {
      target: { value: 'New York' },
    });
    fireEvent.change(screen.getByLabelText('Type'), {
      target: { value: 'Eco' },
    });
    fireEvent.change(screen.getByLabelText('Date'), {
      target: { value: '2024-12-15' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter description'), {
      target: { value: 'Recycle program' },
    });

    // Mock API response for adding an appointment
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

    // Submit the form
    fireEvent.click(screen.getByText('Do payment later'));

    // Ensure fetch was called with the correct data
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/Appointments',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            userId: '123',
            location: 'New York',
            type: 'Eco',
            date: '2024-12-15',
            description: 'Recycle program',
          }),
        })
      );
    });
  });

  it('should open the edit appointment modal and update the appointment', async () => {
    // Mock API response for fetching appointments
    fetchMock.mockResponseOnce(
      JSON.stringify({
        Appointments: [
          {
            id: '1',
            userId: '123',
            location: 'New York',
            type: 'Eco',
            description: 'Recycle program',
            date: '2024-12-15',
            paymentStatus: 'Paid',
          },
        ],
      })
    );

    // Render the component
    render(<ManagementAppointment userId="123" />);

    // Wait for the appointments to be displayed
    await waitFor(() => expect(screen.getByText('Eco')).toBeInTheDocument());

    // Click the "Edit" button
    fireEvent.click(screen.getByText('Edit'));

    // Check if the edit modal opens
    await waitFor(() => expect(screen.getByText('Update Appointment')).toBeInTheDocument());

    // Modify the appointment data
    fireEvent.change(screen.getByPlaceholderText('Enter location'), {
      target: { value: 'San Francisco' },
    });

    // Mock API response for updating the appointment
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

    // Submit the form
    fireEvent.click(screen.getByText('Update Appointment'));

    // Ensure fetch was called with the correct data
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/Appointments/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({
            location: 'San Francisco',
            type: 'Eco',
            date: '2024-12-15',
            description: 'Recycle program',
          }),
        })
      );
    });
  });

  it('should delete an appointment', async () => {
    // Mock API response for fetching appointments
    fetchMock.mockResponseOnce(
      JSON.stringify({
        Appointments: [
          {
            id: '1',
            userId: '123',
            location: 'New York',
            type: 'Eco',
            description: 'Recycle program',
            date: '2024-12-15',
            paymentStatus: 'Paid',
          },
        ],
      })
    );

    // Render the component
    render(<ManagementAppointment userId="123" />);

    // Wait for the appointments to be displayed
    await waitFor(() => expect(screen.getByText('Eco')).toBeInTheDocument());

    // Mock API response for deleting the appointment
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

    // Click the "Delete" button
    fireEvent.click(screen.getByText('Delete'));

    // Ensure the DELETE request was made
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/Appointments/1', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
    });
  });
});
