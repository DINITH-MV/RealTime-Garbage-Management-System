"use client";
import jsVectorMap from "jsvectormap";
import "jsvectormap/dist/jsvectormap.css";
import React, { useEffect } from "react";
import "../../js/Colombo"; // Make sure the map file for Colombo is correctly referenced

type LocationType = {
  binId: string;
  city: string;
  apiUrl: string;
  marker: string;
  latitude: number;
  longitude: number;
  createdAt: string;
};

interface MapOneProps {
  filteredLocations: LocationType[];
}

const MapOne: React.FC<MapOneProps> = ({ filteredLocations }) => {
  useEffect(() => {
    // Convert filteredLocations to marker format
    const markers = filteredLocations.map((location) => ({
      name: location.city,
      coords: [location.latitude, location.longitude] as [number, number],
      style: {
        initial: {
          fill: location.marker, // Use marker color from db
          stroke: location.marker,
          "stroke-width": 4,
        },
      },
    }));

    const mapOne = new jsVectorMap({
      selector: "#mapOne",
      map: "Colombo",
      zoomButtons: true,
      markers: markers, // Use the markers from filteredLocations
      labels: {
        markers: {
          render: function (marker: { name: string }) {
            return marker.name;
          },
        },
      },
      regionStyle: {
        initial: {
          fill: "#f4b369",
        },
        hover: {
          fillOpacity: 1,
          fill: "#e6c819",
        },
      },
      background: "#f7f7f7",
      zoom: {
        enabled: true,
        onLoad: 6,
      },
      center: {
        lat: 6.9271, // Latitude of Colombo
        lng: 79.8612, // Longitude of Colombo
      },
    });

    return () => {
      const map = document.getElementById("mapOne");
      if (map) {
        map.innerHTML = "";
      }
    };
  }, [filteredLocations]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-7">
      <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
        Region labels
      </h4>
      <div className="mt-[20px] h-90 rounded-[14px] border-[8px] border-[#eeeeee] bg-[rgb(250,247,247)] p-[10px] ">
        <div id="mapOne" className="mapOne map-btn"></div>
      </div>
    </div>
  );
};

export default MapOne;
