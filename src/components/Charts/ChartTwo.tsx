import { ApexOptions } from "apexcharts";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import html2canvas from "html2canvas";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options: ApexOptions = {
  colors: ["#c6b414", "#80CAEE"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "bar",
    height: 335,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: "25%",
          },
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: "25%",
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: "last",
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: [], // To be dynamically updated
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    fontFamily: "Satoshi",
    fontWeight: 500,
    fontSize: "14px",
    markers: {
      radius: 99,
    },
  },
  fill: {
    opacity: 1,
  },
};

type LocationType = {
  binId: string;
  city: string;
  apiUrl: string;
  marker: string;
  latitude: number;
  longitude: number;
  createdAt: string;
};

interface LocationDataProps {
  filteredLocations: LocationType[];
}

const ChartTwo: React.FC<LocationDataProps> = ({ filteredLocations }) => {
  // Set the initial city to "SLIIT" if it exists, otherwise default to the first location
  const [selectedCity, setSelectedCity] = useState<LocationType | null>(
    filteredLocations.find((location) => location.city === "SLIIT") ||
      filteredLocations[0],
  );

  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([
    {
      name: "Bin Level",
      data: [], // Placeholder, real data will be fetched
    },
  ]);
  const [categories, setCategories] = useState<string[]>([]);

  const fetchRealTimeData = async () => {
    if (!selectedCity) return; // Exit if no city is selected

    try {
      const response = await fetch(selectedCity.apiUrl); // Use selected city's API URL

      const data = await response.json();
      const binLevel = parseInt(data, 10); // Parse the fetched data (assuming it's a number)
      const currentTime = new Date().toLocaleTimeString(); // Capture the current time

      setSeries((prevSeries) => [
        {
          ...prevSeries[0],
          data: [...prevSeries[0].data, binLevel].slice(-7), // Keep only the latest 7 values
        },
      ]);

      setCategories((prevCategories) =>
        [...prevCategories, currentTime].slice(-7),
      ); // Keep only the latest 7 timestamps
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchRealTimeData(); // Initial fetch
    const intervalId = setInterval(fetchRealTimeData, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [selectedCity]); // Re-run the effect if the selected city changes

  // Handle city selection
  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCityName = event.target.value;
    const selectedCityData = filteredLocations.find(
      (location) => location.city === selectedCityName,
    );

    // Reset series and categories when a new city is selected
    setSeries([{ name: "Bin Level", data: [] }]); // Reset the series data
    setCategories([]); // Reset the categories (timestamps)

    setSelectedCity(selectedCityData || null); // Update selected city and fetch new data
  };

  // Function to generate and download CSV
  const downloadCSV = () => {
    const csvData = series.map((serie) =>
      [serie.name, ...serie.data].join(","),
    );

    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Time", ...categories].join(",") +
      "\n" +
      csvData.join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "chart_data.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
  };

  // Function to download the chart as JPG
  const downloadJPG = () => {
    const chartElement = document.getElementById("chartTwo");

    if (chartElement) {
      html2canvas(chartElement).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/jpeg", 1.0);
        link.download = "chart_report.jpg";
        link.click();
      });
    }
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-center gap-4 sm:flex">
        <div>
          <h4 className="text-center text-xl font-semibold text-[#62748a] dark:text-white">
            Real-Time Bin Levels Log
          </h4>
        </div>
      </div>
      <div className="mb-[20px] flex w-[300px] justify-around">
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

      <div>
        <div id="chartTwo" className="-mb-9 -ml-5">
          <ReactApexChart
            options={{ ...options, xaxis: { categories } }} // Update xaxis with real-time categories
            series={series}
            type="bar"
            height={350}
            width={"100%"}
          />
        </div>
      </div>

      {/* Download CSV & JPG Buttons */}
      <div className="mt-[35px]">
        <button
          onClick={downloadCSV}
          className="rounded-md bg-blue-500 px-4 py-2 text-white"
        >
          Download CSV
        </button>
        <button
          onClick={downloadJPG}
          className="ml-2 rounded-md bg-green-500 px-4 py-2 text-white"
        >
          Download JPG
        </button>
      </div>
    </div>
  );
};

export default ChartTwo;
