"use client";
import { useState } from 'react';
import axios from 'axios';
import ViewWastePickup from '@/components/WastePickup/MyWastePickup';
import MyWastePickup from '@/components/WastePickup/MyWastePickup';

const route: React.FC = () => {
  return (
	<div>
	 <MyWastePickup/>
	</div>
  );
};

export default route;
