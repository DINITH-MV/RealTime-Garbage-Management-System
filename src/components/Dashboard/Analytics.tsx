"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import ChartOne from "../Charts/ChartOne";
import ChartTwo from "../Charts/ChartTwo";
import ChatCard from "../Chat/ChatCard";
import TableOne from "../Tables/TableOne";
import CardDataStats from "../CardDataStats";

const MapOne = dynamic(() => import("@/components/Maps/MapOne"), {
  ssr: false,
});

const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
  ssr: false,
});

type LocationData = {
  id: string;
  city: string;
  apiUrl: string;
  latitude: number;
  longitude: number;
  createdAt: string;
};
interface AnalyticsProps {
  locations: LocationData[]
}

const Analytics: React.FC<AnalyticsProps> = ({locations}) => {
  const [filteredLocations, setFilteredLocations] = useState<LocationData[]>(locations);

  useEffect(() => {
    const results = locations.filter(location =>
      feedback.messages.toLowerCase().includes(searchQuery.toLowerCase()) &&
      feedback.reply.toLowerCase().includes(replyQuery.toLowerCase())
    );
    setFilteredFeedbacks(results);
  }, [searchQuery, replyQuery, formattedFeedbacks]);
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5"></div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
        <MapOne />
        
      </div>
    </>
  );
};

export default Analytics;
