import Image from "next/image";

const AuthLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return ( 
    <div className="h-[100vh] flex justify-center items-center">
      <div className="hidden">
        <Image src="/auth-image-coding.jpg" width={500} height={500} alt="auth-image" className="object-cover w-full h-screen"/>
      </div>
      <div className="lg:col-span-6 flex justify-center items-center">
        {children}
      </div>
    </div>
   );
}
 
export default AuthLayout;