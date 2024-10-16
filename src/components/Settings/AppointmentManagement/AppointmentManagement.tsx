"use client"

import Payment from "../Payment/Payment";
import { useRouter } from "next/navigation";

const AppointmentManagement: React.FC<{}> = () => {    
  
const router = useRouter();

const PaymentNav = () => {
  router.push("/user/settings/Payment");
}

  return (
  <div>Add the Appointments Management table page
    <button onClick={PaymentNav}>Payment</button>
  </div>
);
}

export default AppointmentManagement;