"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SelectGroupOne from "@/components/SelectGroup/SelectGroupOne";
import { useEffect, useState } from "react";
import getAllLocations from "../../../../actions/get-locations";

type LocationData = {
  id: string;
  city: string;
  apiUrl: string;
  marker: string;
  latitude: number;
  longitude: number;
  createdAt: string;
};
interface AnalyticsProps {
  locations: LocationData[];
}

const AreaManagement: React.FC<AnalyticsProps> = ({ locations }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const filteredLocations = locations.filter(
    (location) =>
      location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.apiUrl.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalEntries = locations.length; // Total number of entries
  const currentPage = 1; // Example value, this would typically come from state
  const entriesPerPage = 3; // Example value, could be adjustable

  const startIndex = (currentPage - 1) * entriesPerPage + 1;
  const endIndex = Math.min(currentPage * entriesPerPage, totalEntries);

  return (
    <div>
      <Breadcrumb pageName="Settings / Area Management" />
      {/* Top Channels */}
      <div className="font-sans bg-gray-200 antialiased">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="py-8">
            <div>
              <h2 className="text-2xl font-semibold leading-tight">Areas</h2>
            </div>
            <div className="my-2 flex w-full flex-col sm:flex-row">
              <div className="mb-1 flex flex-row sm:mb-0">
                <div className="relative">
                  <select className="border-gray-400 text-gray-700 focus:border-gray-500 block h-full w-full appearance-none rounded-l border bg-white px-4 py-2 pr-8 leading-tight focus:bg-white focus:outline-none dark:bg-[#23621c] dark:text-[#fff]">
                    <option>4</option>
                  </select>
                  <div className="text-gray-700 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                    <svg
                      className="h-4 w-4 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                <div className="relative">
                  <div className="text-gray-700 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                    <svg
                      className="h-4 w-4 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
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
                  className="border-gray-400 text-gray-700 placeholder-gray-400 focus:placeholder-gray-600 focus:text-gray-700 block w-full rounded-r-[4px] border bg-white py-2 pl-8 pr-6 text-[14pt] focus:bg-white focus:outline-none dark:bg-[#23621c] dark:text-white placeholder:dark:text-[#fff]"
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
                NEW CITY
              </button>
            </div>

            <div className="-mx-4 overflow-x-auto px-4 py-4 sm:-mx-8 sm:px-8">
              <div className="inline-block min-w-full overflow-hidden rounded-lg shadow">
                <table className="min-w-full leading-normal">
                  <thead className="bg-[#15752e] text-[#f5fbf0] dark:bg-[#174312]">
                    <tr>
                      <th className="bg-gray-100 border-gray-200 text-gray-600 border-b-2 px-5 py-3  text-left font-semibold uppercase tracking-wider">
                        City
                      </th>
                      <th className="bg-gray-100 border-gray-200 text-gray-600 border-b-2 px-5 py-3  text-left font-semibold uppercase tracking-wider">
                        Blynk Key
                      </th>
                      <th className="bg-gray-100 border-gray-200 text-gray-600 border-b-2 px-5 py-3  text-left font-semibold uppercase tracking-wider">
                        Marker
                      </th>
                      <th className="bg-gray-100 border-gray-200 text-gray-600 border-b-2 px-5 py-3  text-left font-semibold uppercase tracking-wider">
                        Latitude
                      </th>
                      <th className="bg-gray-100 border-gray-200 text-gray-600 border-b-2 px-5 py-3  text-left font-semibold uppercase tracking-wider">
                        Longitude
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
                        <td className="border-gray-200 max-w-[260px] overflow-hidden text-ellipsis whitespace-nowrap border-b px-5 py-5 text-[14pt]">
                          <p className="text-gray-900 ">{location.apiUrl}</p>
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
                        <td className="border-gray-200 flex border-b border-b-[#fff] px-5 py-5 text-[14pt] dark:border-b-[#fff]">
                          <button className="rounded-[7px] bg-[#cee797] p-[8px]">
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
                          <button className="text-red-600 hover:text-red-900 ml-2 rounded-[7px] bg-[#fae6d1] p-[9px]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Pop-Up Modal
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              This is the content of the pop-up modal. You can add any content
              you want here, including buttons, forms, etc.
            </p>

            {/* Close Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AreaManagement;
