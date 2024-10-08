import { UserButton } from "@clerk/nextjs";


export default function Page() {
    return (
            <UserButton
          afterSignOutUrl="/"
          appearance={{
            variables: {
              colorPrimary: 'blue',
              colorText: 'black',
              fontSize: '18px',
            },
          }}
          userProfileMode="modal" /> 
    );
}