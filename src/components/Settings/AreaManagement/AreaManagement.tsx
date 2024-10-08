"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type LocationData = {
  id: string;
  city: string;
  apiUrl: string;
  userId: string;
  marker: string;
  latitude: number;
  longitude: number;
  createdAt: string;
};

interface AreaManagementProps {
  locations: LocationData[];
}

const AreaManagement: React.FC<AreaManagementProps> = ({ locations }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(
    null,
  ); // Used for updating
  const [locationList, setLocationList] = useState<LocationData[]>(locations); // Use local state for locations

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setCurrentLocation(null); // Reset on close
  };

  const filteredLocations = locationList.filter(
    (location) =>
      location.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      "" ||
      location.apiUrl?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      "",
  );

  const totalEntries = locationList.length;
  const currentPage = 1; // Example value, this would typically come from state
  const entriesPerPage = 3; // Example value, could be adjustable
  const startIndex = (currentPage - 1) * entriesPerPage + 1;
  const endIndex = Math.min(currentPage * entriesPerPage, totalEntries);

  // State for form fields
  const [city, setCity] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [userId, setUserId] = useState("");
  const [marker, setMarker] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    if (currentLocation) {
      // If editing, pre-fill the form
      setCity(currentLocation.city);
      setApiUrl(currentLocation.apiUrl);
      setUserId(currentLocation.userId);
      setMarker(currentLocation.marker);
      setLatitude(currentLocation.latitude.toString());
      setLongitude(currentLocation.longitude.toString());
    } else {
      // Reset fields for new location
      setCity("");
      setApiUrl("");
      setUserId("");
      setMarker("");
      setLatitude("");
      setLongitude("");
    }
  }, [currentLocation]);

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const locationData = {
      city,
      apiUrl,
      userId,
      marker,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    try {
      let response;

      if (currentLocation) {
        // Updating an existing location
        response = await fetch(`/api/Area-Management/${currentLocation.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(locationData),
        });
        toast.success("Location updated!");

        if (response.ok) {
          // Update the location in the local state
          setLocationList((prevList) =>
            prevList.map((loc) =>
              loc.id === currentLocation.id ? { ...loc, ...locationData } : loc,
            ),
          );
        }
      } else {
        // Adding a new location
        response = await fetch("/api/Area-Management", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(locationData),
        });

        if (response.ok) {
          toast.success("Location added!");
          window.location.reload();
        }
      }

      if (response.ok) {
        console.log(
          currentLocation
            ? "Location updated successfully!"
            : "Location added successfully!",
        );
        closeModal(); // Close the modal
      } else {
        console.error("Failed to save location.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Function to handle opening the form to edit a location
  const handleEdit = (location: LocationData) => {
    setCurrentLocation(location);
    openModal();
  };

  const onDelete = async (codeId: string) => {
    try {
      await axios.delete(`/api/Area-Management/${codeId}`);
      toast.success("Location deleted!");

      setLocationList((prevList) =>
        prevList.filter((loc) => loc.id !== codeId),
      );
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <Breadcrumb pageName="Settings / Area Management" />
      <div className="font-sans bg-gray-200 antialiased">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="py-8">
            <div>
              <h2 className="text-2xl font-semibold leading-tight">Areas</h2>
            </div>
            <div className="my-2 flex w-full flex-col sm:flex-row">
              <div className="relative block">
                <span className="absolute inset-y-0 left-0 flex h-full items-center pl-2">
                  <svg
                    viewBox="0 0 24 24"
                    className="text-gray-500 h-4 w-4 fill-current dark:text-[#fff]"
                  >
                    <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"></path>
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-gray-400 text-gray-700 placeholder-gray-400 focus:placeholder-gray-600 focus:text-gray-700 block w-full rounded-[7px] border bg-white py-2 pl-8 pr-6 text-[14pt] focus:bg-white focus:outline-none dark:bg-[#23621c] dark:text-white placeholder:dark:text-[#fff]"
                />
              </div>
            </div>
            <div className="mx-auto mt-[15px] text-center text-[14pt]">
              <button
                className="h-[50px] w-full rounded-[8px] bg-[#756b16] font-semibold text-white hover:bg-[#8c8224]"
                onClick={openModal}
              >
                <i
                  className="fa-duotone fa-solid fa-hexagon-plus mr-[10px] text-[15pt]"
                  style={
                    {
                      "--fa-primary-color": "#fffff",
                      "--fa-secondary-color": "#fffff",
                    } as React.CSSProperties
                  }
                ></i>
                NEW LOCATION
              </button>
            </div>

            <div className="-mx-4 overflow-x-auto px-4 py-4 sm:-mx-8 sm:px-8">
              <div className="inline-block min-w-full overflow-hidden rounded-lg shadow">
                <table className="min-w-full leading-normal">
                  <thead className="bg-[#15752e] text-[#f5fbf0] dark:bg-[#174312]">
                    <tr>
                      <th className="bg-gray-100 border-gray-200 text-gray-600 border-b-2 px-5 py-3  text-left font-semibold uppercase tracking-wider">
                        Location
                      </th>
                      <th className="bg-gray-100 border-gray-200 text-gray-600 border-b-2 px-5 py-3  text-left font-semibold uppercase tracking-wider">
                        Blynk Key
                      </th>
                      <th className="bg-gray-100 border-gray-200 text-gray-600 border-b-2 px-5 py-3  text-center font-semibold uppercase tracking-wider">
                        Marker
                      </th>
                      <th className="bg-gray-100 border-gray-200 text-gray-600 border-b-2 px-5 py-3  text-left font-semibold uppercase tracking-wider">
                        Latitude
                      </th>
                      <th className="bg-gray-100 border-gray-200 text-gray-600 border-b-2 px-5 py-3  text-left font-semibold uppercase tracking-wider">
                        Longitude
                      </th>
                      <th className="bg-gray-100 border-gray-200 text-gray-600 border-b-2 px-5 py-3  text-center font-semibold uppercase tracking-wider">
                        UserID
                      </th>
                      <th className="bg-gray-100 border-gray-200 text-gray-600 border-b-2  px-5 py-3  text-left font-semibold uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLocations.map((location) => (
                      <tr
                        key={location.id}
                        className="border-gray-200 border-b dark:border-[#1a4e17] dark:bg-[#23621c] dark:text-[#fff]"
                      >
                        <td className="border-gray-200 border-b px-5 py-5 text-[14pt]">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {location.city}
                          </p>
                        </td>
                        <td className="border-gray-200 max-w-[260px] border-b px-5 py-5 text-[14pt]">
                          <p className="text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap">
                            {location.apiUrl}
                          </p>
                        </td>
                        <td className="border-gray-200 border-b px-5 py-5 text-[14pt]">
                          <div className="flex items-center">
                            <div
                              className="mr-2 h-4 w-4 rounded-full"
                              style={{ backgroundColor: location.marker }}
                            ></div>
                            <span>{location.marker}</span>
                          </div>
                        </td>
                        <td className="border-gray-200 border-b px-5 py-5 text-[14pt]">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {location.latitude}
                          </p>
                        </td>
                        <td className="border-gray-200 border-b px-5 py-5 text-[14pt]">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {location.longitude}
                          </p>
                        </td>
                        <td className="border-gray-200 border-b px-5 py-5 text-[14pt]">
                          <p className="text-gray-900 max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap text-center">
                            {location.userId}
                          </p>
                        </td>
                        <td className="border-gray-200 flex border-b border-b-[#fff] px-5 py-5 text-[14pt] dark:border-b-[#fff]">
                          <button
                            className="rounded-[7px] bg-[#cee797] p-[8px]"
                            onClick={() => handleEdit(location)}
                          >
                            <i
                              className="fa-duotone fa-solid fa-marker text-[17pt]"
                              style={
                                {
                                  "--fa-primary-color": "#007500",
                                  "--fa-secondary-color": "#007500",
                                } as React.CSSProperties
                              }
                            ></i>
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 ml-2 rounded-[7px] bg-[#fae6d1] p-[9px]"
                            onClick={() => onDelete(location.id)}
                          >
                            <i
                              className="fa-duotone fa-solid fa-trash text-[18pt]"
                              style={
                                {
                                  "--fa-primary-color": "#d70000",
                                  "--fa-secondary-color": "#f3652e",
                                } as React.CSSProperties
                              }
                            ></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex items-center justify-between bg-[#15752e] px-5 py-5 text-[#f5fbf0]  dark:border-[#1a4e17] dark:bg-[#1d5517] dark:text-[#fff]">
                  <span className="text-gray-900 text-xs sm:text-sm">
                    {`Showing ${startIndex} to ${endIndex} of ${totalEntries} Entries`}{" "}
                  </span>
                  <div className="xs:mt-0 mt-2 inline-flex">
                    <button className="bg-gray-300 text-gray-800 hover:bg-gray-400 rounded-l px-4 py-2 text-[14pt] font-semibold">
                      Prev
                    </button>
                    <button className="bg-gray-300 text-gray-800 hover:bg-gray-400 rounded-r px-4 py-2 text-[14pt] font-semibold">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal (Pop-Up) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 mt-[50px] flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex max-h-[700px] w-[30%] min-w-[380px] flex-col gap-7">
            <div className="rounded-[16px] border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className=" border-stroke px-6.5 py-1 dark:border-strokedark">
                <div className="float-right ">
                  <button
                    onClick={closeModal}
                    className="bg-red-500 hover:bg-red-600 rounded-lg text-black"
                  >
                    <i
                      className="fa-duotone fa-solid fa-circle-xmark mr-[0px] mt-[5px] text-[24pt]"
                      style={
                        {
                          "--fa-primary-color": "#fff",
                          "--fa-secondary-color": "#ff4141",
                          "--fa-secondary-opacity": "1",
                        } as React.CSSProperties
                      }
                    ></i>
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="p-6.5">
                  {/* Form Fields */}
                  <div className="mb-4.5 w-full">
                    <label className="mb-3 block text-sm font-medium text-[#000000] dark:text-white">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Eg: Kaluthara"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-4.5 w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Blynk key
                    </label>
                    <input
                      type="text"
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      placeholder="Ex: https://sgp1.blynk.cloud/external/api/get?token=R9UM..."
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-4.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Color of the Marker
                    </label>
                    <input
                      type="text"
                      value={marker}
                      onChange={(e) => setMarker(e.target.value)}
                      placeholder="Eg: #ff0000"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-4.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Latitude
                    </label>
                    <input
                      type="text"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      placeholder="Eg: 8.9585"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-4.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Longitude
                    </label>
                    <input
                      type="text"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      placeholder="Eg: 65.8612"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-4.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      UserID
                    </label>
                    <input
                      type="text"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="Eg: 65.8612"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                    {currentLocation ? "Update Location" : "Add a Place"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AreaManagement;
