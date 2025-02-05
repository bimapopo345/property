import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, beforeEach, test, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import PropertiesPage from "../Propertiespage";

// Mock axios
vi.mock("axios");

// Mock data
const mockProperties = [
  {
    _id: "1",
    title: "Modern Apartment",
    location: "Downtown City",
    price: 750000,
    image: ["https://example.com/apartment1.jpg"],
    beds: 2,
    baths: 2,
    sqft: 1200,
    type: "apartment",
    availability: "available",
    description: "A luxurious modern apartment in the heart of the city",
    amenities: ["gym", "parking", "security"],
    phone: "1234567891",
  },
  {
    _id: "2",
    title: "Beach House",
    location: "Coastal Area",
    price: 1200000,
    image: ["https://example.com/beach1.jpg"],
    beds: 4,
    baths: 3,
    sqft: 2500,
    type: "house",
    availability: "available",
    description: "Beautiful beachfront property with amazing ocean views",
    amenities: ["pool", "beach access", "garage"],
    phone: "1234567892",
  },
];

// Wrap component with router for navigation
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("PropertiesPage", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: { property: mockProperties, success: true },
    });
  });

  test("loads and displays properties", async () => {
    renderWithRouter(<PropertiesPage />);

    // Check loading state
    expect(
      screen.getByText("Loading amazing properties...")
    ).toBeInTheDocument();

    // Wait for properties to load
    await waitFor(() => {
      expect(screen.getByText("Modern Apartment")).toBeInTheDocument();
      expect(screen.getByText("Beach House")).toBeInTheDocument();
    });

    // Check if property details are displayed
    expect(screen.getByText("Downtown City")).toBeInTheDocument();
    expect(screen.getByText("2 Beds")).toBeInTheDocument();
  });

  test("filters properties by search", async () => {
    renderWithRouter(<PropertiesPage />);

    // Wait for properties to load
    await waitFor(() => {
      expect(screen.getByText("Modern Apartment")).toBeInTheDocument();
    });

    // Find and fill search input
    const searchInput = screen.getByPlaceholderText(
      /search by location, property type/i
    );
    fireEvent.change(searchInput, { target: { value: "beach" } });

    // Submit search
    const searchButton = screen.getByRole("button", { name: /search/i });
    fireEvent.click(searchButton);

    // Check filtered results
    await waitFor(() => {
      expect(screen.queryByText("Modern Apartment")).not.toBeInTheDocument();
      expect(screen.getByText("Beach House")).toBeInTheDocument();
    });
  });

  test("sorts properties by price", async () => {
    renderWithRouter(<PropertiesPage />);

    await waitFor(() => {
      expect(screen.getByText("Modern Apartment")).toBeInTheDocument();
    });

    // Find and use sort dropdown
    const sortSelect = screen.getByRole("combobox");
    fireEvent.change(sortSelect, { target: { value: "price-desc" } });

    // Verify sort order by price display
    await waitFor(() => {
      const prices = screen.getAllByText(/₹/);
      expect(prices[0]).toHaveTextContent("₹1,200,000");
      expect(prices[1]).toHaveTextContent("₹750,000");
    });
  });

  test("toggles filter panel", async () => {
    renderWithRouter(<PropertiesPage />);

    await waitFor(() => {
      expect(screen.getByText("Modern Apartment")).toBeInTheDocument();
    });

    // Find and click filter toggle button
    const filterToggle = screen.getByTitle("Toggle Filters");
    fireEvent.click(filterToggle);

    // Check if filter panel is shown
    await waitFor(() => {
      expect(screen.queryByRole("complementary")).toBeInTheDocument();
    });

    // Click again to hide
    fireEvent.click(filterToggle);

    // Check if filter panel is hidden
    await waitFor(() => {
      expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
    });
  });

  test("handles error state", async () => {
    // Mock failed API call
    axios.get.mockRejectedValueOnce(new Error("Failed to fetch"));

    renderWithRouter(<PropertiesPage />);

    // Check if error message is shown
    await waitFor(() => {
      expect(
        screen.getByText(/failed to fetch properties/i)
      ).toBeInTheDocument();
    });

    // Check if retry button is present
    const retryButton = screen.getByRole("button", { name: /try again/i });
    expect(retryButton).toBeInTheDocument();

    // Mock successful retry
    axios.get.mockResolvedValueOnce({
      data: { property: mockProperties, success: true },
    });

    // Click retry button
    fireEvent.click(retryButton);

    // Check if properties are loaded after retry
    await waitFor(() => {
      expect(screen.getByText("Modern Apartment")).toBeInTheDocument();
    });
  });
});
