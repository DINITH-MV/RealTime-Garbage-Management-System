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
  return (
    <div>
      <Breadcrumb pageName="Settings / Area Management" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          {/* Top Channels */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
              <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                Areas
              </h4>

              <div className="flex flex-col">
                <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
                  <div className="p-2.5 xl:p-5 w-[120px]">
                    <h5 className="text-sm font-medium uppercase xsm:text-base">
                      City
                    </h5>
                  </div>
                  <div className="p-2.5 text-center xl:p-5">
                    <h5 className="text-sm font-medium uppercase xsm:text-base">
                      Blynk Key
                    </h5>
                  </div>
                  <div className="p-2.5 text-center xl:p-5">
                    <h5 className="text-sm font-medium uppercase xsm:text-base">
                      Marker
                    </h5>
                  </div>
                  <div className="hidden p-2.5 text-center sm:block xl:p-5">
                    <h5 className="text-sm font-medium uppercase xsm:text-base">
                      langitude
                    </h5>
                  </div>
                  <div className="hidden p-2.5 text-center sm:block xl:p-5">
                    <h5 className="text-sm font-medium uppercase xsm:text-base">
                      longitude
                    </h5>
                  </div>
                </div>

                {locations.map((location) => (
                  <div
                    className={`grid grid-cols-3 sm:grid-cols-5`}
                    key={location.id}
                  >
                    <div className="flex items-center p-2.5 xl:p-5 w-[120px]">
                      <p className="text-black dark:text-white sm:block">
                        {location.city}
                      </p>
                    </div>

                    <div className="flex w-[160px] items-center justify-center p-2.5 xl:p-5">
                      <p className="w-[160px] overflow-hidden text-ellipsis whitespace-nowrap text-black dark:text-white">
                        {location.apiUrl}
                      </p>
                    </div>

                    <div className="flex items-center justify-start p-2.5 xl:p-5">
                      <div className="w-[15px] h-[15px] mr-[7px] "  style={{ backgroundColor: location.marker }}>

                      </div>
                      <p>
                        {location.marker}
                      </p>
                    </div>

                    <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                      <p className="text-[#23ade8] dark:text-white">
                        {location.longitude}
                      </p>
                    </div>

                    <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                      <p className="text-[#23ade8]">{location.longitude}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-9">
          {/* Contact Form */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Waste Area Management
              </h3>
            </div>
            <form action="#">
              <div className="p-6.5">
                {/* Form Fields */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      First name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your first name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Last name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your last name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Email <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Select subject"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <SelectGroupOne />

                <div className="mb-6">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Type your message"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  ></textarea>
                </div>

                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaManagement;
