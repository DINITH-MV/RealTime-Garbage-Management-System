import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
import PaymentCardManagement from '../BillSection';

beforeAll(() => {
  fetchMock.enableMocks();
});

beforeEach(() => {
  fetchMock.resetMocks();
});

describe('PaymentCardManagement', () => {
  it('should fetch and display card details', async () => {
    // Mock the API response
    fetchMock.mockResponseOnce(
      JSON.stringify({
        PaymentCardDetails: [
          {
            id: 1,
            cardNumber: '1234567812345678',
            ownerName: 'John Doe',
            cvc: '123',
            expDate: '2024-12-01T00:00:00.000Z',
            createdAt: '2021-11-10T00:00:00.000Z',
          },
        ],
      })
    );

    // Render the component
    render(<PaymentCardManagement />);

    // Wait for the loading to finish and card details to be displayed
    expect(screen.getByText('Loading payment card details...')).toBeInTheDocument();

    await waitFor(() => expect(screen.queryByText('Loading payment card details...')).not.toBeInTheDocument());

    // Check that the card details are displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('************5678')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('12/1/2024')).toBeInTheDocument();
  });

  it('should open update modal and submit updated card details', async () => {
    // Mock the API response
    fetchMock.mockResponseOnce(
      JSON.stringify({
        PaymentCardDetails: [
          {
            id: 1,
            cardNumber: '1234567812345678',
            ownerName: 'John Doe',
            cvc: '123',
            expDate: '2024-12-01T00:00:00.000Z',
            createdAt: '2021-11-10T00:00:00.000Z',
          },
        ],
      })
    );

    // Render the component
    render(<PaymentCardManagement />);

    // Wait for card details to be displayed
    await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());

    // Click the "Update" button
    fireEvent.click(screen.getByText('Update'));

    // Check that the update modal appears with pre-filled values
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-12-01')).toBeInTheDocument(); // Date input format

    // Modify the cardholder name
    fireEvent.change(screen.getByDisplayValue('John Doe'), {
      target: { value: 'Jane Doe' },
    });

    // Submit the form
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
    fireEvent.click(screen.getByText('Save'));

    // Ensure the PATCH request was made with updated data
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/Payment/1', expect.anything());
    });

    // Check if the cardholder name is updated
    await waitFor(() => expect(screen.getByText('Jane Doe')).toBeInTheDocument());
  });

  it('should open delete modal and confirm deletion', async () => {
    // Mock the API response
    fetchMock.mockResponseOnce(
      JSON.stringify({
        PaymentCardDetails: [
          {
            id: 1,
            cardNumber: '1234567812345678',
            ownerName: 'John Doe',
            cvc: '123',
            expDate: '2024-12-01T00:00:00.000Z',
            createdAt: '2021-11-10T00:00:00.000Z',
          },
        ],
      })
    );

    // Render the component
    render(<PaymentCardManagement />);

    // Wait for card details to be displayed
    await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());

    // Click the "Delete" button
    fireEvent.click(screen.getByText('Delete'));

    // Check that the delete modal appears
    expect(screen.getByText('Are you sure you want to delete this card?')).toBeInTheDocument();

    // Confirm deletion
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
    fireEvent.click(screen.getByText('Delete'));

    // Ensure the DELETE request was made
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/Payment/1', { method: 'DELETE' });
    });

    // Ensure the card is removed from the list
    await waitFor(() => expect(screen.queryByText('John Doe')).not.toBeInTheDocument());
  });

  it('should show an error if the fetch request fails', async () => {
    // Mock the API response with an error
    fetchMock.mockReject(new Error('Failed to fetch Payment Card Details'));

    // Render the component
    render(<PaymentCardManagement />);

    // Wait for the error message to appear
    await waitFor(() => expect(screen.getByText('Error: Failed to fetch Payment Card Details')).toBeInTheDocument());
  });
});
