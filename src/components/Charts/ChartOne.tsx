"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import html2canvas from "html2canvas";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ChartOne = (filteredLocations: any) => {
  const [series, setSeries] = useState([
    {
      name: "Kaduwela",
      data: Array(8).fill(80),
    },
    {
      name: "Malabe",
      data: Array(8).fill(70),
    },
    {
      name: "SLIIT",
      data: Array(8).fill(30), // Initial data for SLIIT
    },
  ]);

  const [currentCategory, setCurrentCategory] = useState<string[]>([]);

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#6ab314", "#e4ea14", "#f35f5f"], // Colors for the series
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
      strokeColors: ["#47a114", "#c88b0a", "#f03116"], // Marker stroke colors
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
      categories: currentCategory, // Dynamically set categories
    },
    yaxis: {
      min: 0,
      max: 100,
    },
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

  // Function to fetch data from the API and update series
  const fetchDataFromAPI = async () => {
    try {
      const response = await fetch(
        "https://random-number-generator-7jp6.onrender.com/value"
      );
      const data = await response.json();

      // Shift previous data points and append the new data
      const newSLIITData = [...series[2].data.slice(1), data]; // Shift and append

      // Update the series with the new SLIIT data while keeping others unchanged
      const newSeries = [
        {
          name: "Kaduwela",
          data: series[0].data, // Keep constant for now
        },
        {
          name: "Malabe",
          data: series[1].data, // Keep constant for now
        },
        {
          name: "SLIIT",
          data: newSLIITData, // Update entire data sequence for SLIIT
        },
      ];

      setSeries(newSeries); // Update the series with the new data
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  // Function to generate time labels for the x-axis
  const generateTimeLabels = (): string[] => {
    const labels: string[] = [];
    const now = new Date();

    for (let i = 7; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 3 * 60 * 1000);
      const formattedTime = time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      labels.push(formattedTime);
    }

    return labels;
  };

  // UseEffect to update chart periodically every 6 seconds
  useEffect(() => {
    const fetchAndUpdate = () => {
      fetchDataFromAPI(); // Fetch new data every 6 seconds
      setCurrentCategory(generateTimeLabels()); // Update the time labels
    };

    fetchAndUpdate(); // Initial call

    const interval = setInterval(fetchAndUpdate, 2000); // 6 seconds interval

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [series[0]]); // Add series as a dependency to ensure it updates correctly

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-[#fa4d2c]">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-[#fa4d2c]"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-[#fa4d2c]">SLIIT</p>
              <p className="text-sm font-medium">Real time garbage level</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-[#46a93f]">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-[#46a93f]"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-[#46a93f]">Kaduwela</p>
              <p className="text-sm font-medium">Real time garbage level</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-[#d19837]">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-[#d19837]"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-[#d19837]">Malabe</p>
              <p className="text-sm font-medium">Real time garbage level</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options} // Pass the options here
            series={series} // Series data (updated dynamically)
            type="area"
            height={350}
            width={"100%"}
          />
        </div>
      </div>

      {/* Buttons for Downloading CSV and JPG */}
      <div className="mt-4">
        <button
          onClick={downloadCSV}
          className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Download CSV
        </button>
        <button
          onClick={downloadJPG}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Download JPG
        </button>
      </div>
    </div>
  );
};

export default ChartOne;
