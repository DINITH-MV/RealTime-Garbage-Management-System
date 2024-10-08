import { SignIn } from "@clerk/nextjs";
 
export default function Page() {
  return <SignIn 
  appearance={{
    variables: {
      colorText: 'black',
      fontSize: '18px',
      colorPrimary: "rgb(247 201 115)",
      colorTextOnPrimaryBackground: "black",
    },
  }}/>;
}