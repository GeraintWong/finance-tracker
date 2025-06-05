import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { Toaster } from "sonner";

type Props = {
    children: React.ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <main>
                    <SidebarTrigger />
                    {children}
                </main>
                <Toaster/>
            </SidebarProvider>
        </>
    )
}

export default DashboardLayout;