// import { Home, Bot, Link, Settings } from 'lucide-react'
// using react-icons
import { FaStream, FaLink, FaCog, FaUsers } from "react-icons/fa";
import { Link } from 'react-router-dom'

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarProvider,
} from '@/components/ui/sidebar'

export default function DashboardSidebar() {
    return (
        <SidebarProvider defaultOpen={true}>
            <Sidebar className="border-r bg-background">
                <SidebarHeader>
                    <h2 className="px-6 py-4 border-b">
                        <span className="text-primary flex items-center text-lg font-medium">
                            FlowOps
                        </span>
                    </h2>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent className="p-2">
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to="/workflows" className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                                            <FaStream className="mr-3 h-4 w-4" />
                                            <span>Workflows</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to="/integrations" className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                                            <FaLink className="mr-3 h-4 w-4" />
                                            <span>Integrations</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to="/team" className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                                            <FaUsers className="mr-3 h-4 w-4" />
                                            <span>Team</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to="/settings" className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                                            <FaCog className="mr-3 h-4 w-4" />
                                            <span>Settings</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </SidebarProvider>
    )
}

