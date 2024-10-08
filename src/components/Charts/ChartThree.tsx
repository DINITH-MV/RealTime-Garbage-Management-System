import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

// Apex Chart options
const options: ApexOptions = {
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "donut",
  },
  colors: ["#70dd51", "#fff"], // Starting with green gradient colors for Garbage Available and Garbage Free
  labels: ["Garbage Available", "Garbage Free"],
  legend: {
    show: false,
    position: "bottom",
  },
  fill: {
    type: "gradient", // Applying gradient
    gradient: {
      shade: "light",
      type: "diagonal1", // You can change this to 'vertical', 'horizontal', etc.
      shadeIntensity: 0.5,
      gradientToColors: ["#399f12", "#afe817"], // End colors for each section
      inverseColors: false,
      opacityFrom: 0.85,
      opacityTo: 0.85,
      stops: [0, 100],
    },
  },
  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        background: "transparent",
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

type LocationType = {
  id: string;
  city: string;
  apiUrl: string;
  userId: string;
  marker: string;
  latitude: number;
  longitude: number;
  createdAt: string;
};

interface LocationDataProps {
  filteredLocations: LocationType[];
}

const ChartThree: React.FC<LocationDataProps> = ({ filteredLocations }) => {
  // State to store the real-time series data
  const [series, setSeries] = useState<number[]>([0, 0]);
  const [selectedCity, setSelectedCity] = useState<LocationType | null>(
    filteredLocations.find((location) => location.city === "SLIIT") ||
      filteredLocations[0],
  );

  // Function to fetch real-time data based on the selected city's API URL
  const fetchData = async () => {
    if (!selectedCity) return; // Exit if no city is selected

    try {
      const response = await fetch(selectedCity.apiUrl); // Use selected city's API URL
      const data = await response.json();

      // Assuming the API returns a numeric value for 'v1' and updating the series
      const desktopData = parseInt(data); // Replace this with actual data logic
      const tabletData = 100 - desktopData; // Assuming 100% for simplicity

      // Update the series with new data
      setSeries([desktopData, tabletData]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Poll the API every 5 seconds
  useEffect(() => {
    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [selectedCity]); // Re-fetch data when the selected city changes

  // Handle city selection change
  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCityName = event.target.value;
    const selectedCityData = filteredLocations.find(
      (location) => location.city === selectedCityName,
    );

    // Update the selected city and reset the chart data
    setSeries([0, 0]); // Reset series
    setSelectedCity(selectedCityData || null); // Update selected city
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Garbage Bin Level
          </h5>
        </div>
        <div>
          <div className="relative z-20 inline-block">
            <select
              name="city"
              id="city"
              onChange={handleCityChange}
              value={selectedCity?.city || ""}
              className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
            >
              {filteredLocations
                .slice()
                .reverse()
                .map((location, index) => (
                  <option
                    key={index}
                    value={location.city}
                    className="dark:bg-boxdark"
                  >
                    {location.city}
                  </option>
                ))}
            </select>
            <span className="absolute right-3 top-1/2 z-10 -translate-y-1/2">
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z"
                  fill="#637381"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart options={options} series={series} type="donut" />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        <div className="w-full px-8 sm:w-1/2">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#5cbd68]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Garbage Available </span>
              <span> {series[0]}% </span>
            </p>
          </div>
        </div>
        <div className="w-full px-8 sm:w-1/2">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#abff6f]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Garbage Free </span>
              <span> {series[1]}% </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartThree;
