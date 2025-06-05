import { SignUp, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

const  signUp= () => {
    return ( 
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <div className="flex items-center justify-center bg-amber-100">
                <div className="text-center">
                    <h1 className="font-extrabold text-8xl text-black">
                        Freenance
                    </h1>
                </div>
            </div>
            <div className="h-full lg:flex flex-col items-center justify-center px-4">
                <div className="text-center space-y-4 pt-8">
                    <h1 className="font-bold text-3xl text-black">
                        Create your Freenance today
                    </h1>
                    <p className="text-base text-[#7E8CA0]">
                        Start tracking your finances today
                    </p>
                </div>
                <div className="flex items-center justify-center mt-8">
                    <ClerkLoaded>
                        <SignUp path="/sign-up"/>
                    </ClerkLoaded>
                    <ClerkLoading>
                        <Loader2 className="animate-spin text-muted-foreground"/>
                    </ClerkLoading>
                </div>
            </div>
        </div>
    ); 
}
 
export default signUp;