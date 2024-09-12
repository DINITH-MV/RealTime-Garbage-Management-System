"use client";
import jsVectorMap from "jsvectormap";
import "jsvectormap/dist/jsvectormap.css";
import React, { useEffect } from "react";
import "../../js/Colombo";

const MapOne: React.FC = () => {
  useEffect(() => {
    const mapOne = new jsVectorMap({
      selector: "#mapOne",
      map: "Colombo",
      zoomButtons: true,
      insets: [
        {
          width: 800,  // Set map width
          height: 600, // Set map height
          bbox: [
            { y: 7.000, x: 79.850 },  // Bounding box top-left corner
            { y: 6.850, x: 80.000 },  // Bounding box bottom-right corner
          ],
        },
      ],
      markers: [
        {
          name: 'Kaduwela',           // Marker name
          coords: [8.9344, -88.9585],  // Coordinates for Kaduwela
          style: {
            initial: {
              fill: '#2ca849',            // Marker fill color
              stroke: '#2ca849',         // Stroke color
              "stroke-width": 4,      // Stroke width
            },
          },
        },
        {
          name: 'SLIIT',           // Marker name
          coords: [3.9344, -74.9585],  // Coordinates for SLIIT
          style: {
            initial: {
              fill: '#ff5331',            // Marker fill color
              stroke: '#ff5331',         // Stroke color
              "stroke-width": 4,      // Stroke width
            },
          },
        },
        {
          name: 'Malabe',            // Another marker for Colombo
          coords: [-5.9271, -65.8612],  // Coordinates for Malabe
          style: {
            initial: {
              fill: '#d69941',            // Marker fill color
              stroke: '#d69941',               // Stroke color
              "stroke-width": 4,      // Stroke width
            },
          },
          label: {
            content: 'Colombo',       // Label text for Colombo
          },
        },
      ],
      labels: {
        markers: {                    // Ensure marker labels are enabled
          render: function(marker: { name: string }) {
            return marker.name;       // Display marker name as the label
          }
        },
      },
      regionStyle: {
        initial: {
          fill: "#f4b369",            // Change the default map fill color (example: blue)
        },
        hover: {
          fillOpacity: 1,
          fill: "#e6c819",            // Change the hover color (example: darker blue)
        },
      },
      background: "#f7f7f7",           // Background color for the map (example: light gray)
      zoom: {
        enabled: true,
        onLoad: 6,                    // Adjust zoom level to zoom in more
      },
      center: {
        lat: 6.9271,                  // Latitude of Colombo
        lng: 79.8612,                 // Longitude of Colombo
      },
    });

    return () => {
      const map = document.getElementById("mapOne");
      if (map) {
        map.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-7">
      <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
        Region labels
      </h4>
      <div className="mt-[20px] h-90 rounded-[14px] border-[8px] border-[#eeeeee] p-[10px] ">
        <div id="mapOne" className="mapOne map-btn "></div>
      </div>
    </div>
  );
};

export default MapOne;
