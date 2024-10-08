"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import html2canvas from "html2canvas";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type LocationType = {
  id: string;
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

const ChartOne: React.FC<LocationDataProps> = ({ filteredLocations }) => {
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string[]>([]);

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: filteredLocations.map((location) => location.marker),
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 335,
      type: "area",
      dropShadow: {
        enabled: true,
        color: "#623CEA14",
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: [2, 2, 2],
      curve: "straight",
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    markers: {
      size: 4,
      colors: "#000",
      strokeColors: filteredLocations.map((location) => location.marker),
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      hover: {
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: "category",
      categories: currentCategory,
    },
    yaxis: {
      min: 0,
      max: 100,
    },
  };

  const fetchDataFromAPI = async () => {
    try {
      // Find the location where city is "SLIIT"
      const sliitLocation = filteredLocations.find(location => location.city === "SLIIT");
  
      if (sliitLocation) {
        // Fetch data from the SLIIT location's apiUrl
        const response = await fetch(sliitLocation.apiUrl);
  
        if (!response.ok) {
          throw new Error(`Failed to fetch data from ${sliitLocation.apiUrl}`);
        }
  
        const data = await response.json();
  
        // Update the series with the fetched data for "SLIIT"
        const updatedSeries = series.map(s => ({
          ...s,
          data: s.name === "SLIIT" ? [...s.data.slice(1), data] : s.data, // Only update data for SLIIT
        }));
  
        setSeries(updatedSeries);
      } else {
        console.log("SLIIT location not found");
      }
    } catch (error) {
      console.error("Error fetching data from SLIIT API:", error);
    }
  };

  useEffect(() => {
    const initialSeries = filteredLocations.map((location) => ({
      name: location.city,
      data: Array(8).fill(
        location.city === "Malabe"
          ? 80
          : location.city === "Kaduwela"
            ? 60
            : location.city === "SLIIT"
              ? 30
              : 10,
      ), // Set constant values for Malabe and Kaduwela
    }));
    setSeries(initialSeries);
    setCurrentCategory(generateTimeLabels()); // Set initial categories
  }, [filteredLocations]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchDataFromAPI(); // Fetch new data for SLIIT
    }, 2000); // Update every 20 seconds (or adjust the interval as needed)

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [series]); // Removed series from the dependency array

  const generateTimeLabels = (): string[] => {
    const labels: string[] = [];
    const now = new Date();

    for (let i = 7; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 2 * 60 * 1000);
      const formattedTime = time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      labels.push(formattedTime);
    }

    return labels;
  };

  // Function to generate CSV
  const downloadCSV = () => {
    const csvData = series.map((serie) => {
      return [serie.name, ...serie.data].join(",");
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Time", ...currentCategory].join(",") +
      "\n" +
      csvData.join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "chart_data.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
  };

  // Function to download the chart as JPG using html2canvas
  const downloadJPG = () => {
    const chartElement = document.getElementById("chartOne");

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
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <h1 className="mb-[17px] text-center text-[16pt] font-semibold">
        Real Time Garbage Levels
      </h1>
      <div className="mx-[14px] flex flex-wrap items-start justify-between sm:flex-nowrap">
        {filteredLocations.map((location, index) => (
          <div key={index} className="flex min-w-47.5">
            <span
              className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border"
              style={{ borderColor: location.marker }}
            >
              <span
                className="block h-2.5 w-full max-w-2.5 rounded-full"
                style={{ backgroundColor: location.marker }}
              ></span>
            </span>
            <div className="w-full">
              <p className="font-semibold" style={{ color: location.marker }}>
                {location.city}
              </p>
              <p className="text-sm font-medium">Garbage level</p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={350}
            width={"100%"}
          />
        </div>
      </div>

      <div className="mt-2">
        <button
          onClick={downloadCSV}
          className="mr-2 rounded-md bg-blue-500 px-4 py-2 text-white"
        >
          Download CSV
        </button>
        <button
          onClick={downloadJPG}
          className="rounded-md bg-green-500 px-4 py-2 text-white"
        >
          Download JPG
        </button>
      </div>
    </div>
  );
};

export default ChartOne;
