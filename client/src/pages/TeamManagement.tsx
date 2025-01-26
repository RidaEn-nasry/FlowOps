import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, MoreHorizontal, Mail } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const TEAM_MEMBERS = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
        avatar: 'https://github.com/shadcn.png',
        status: 'active'
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'Member',
        avatar: null,
        status: 'active'
    },
    // Add more members as needed
]

export default function TeamManagement() {
    const [search, setSearch] = useState("")
    const [showInviteDialog, setShowInviteDialog] = useState(false)

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Team Management</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your team members and their permissions
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="relative w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search team members..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => setShowInviteDialog(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Invite Member
                    </Button>
                </div>
            </div>

            <Card>
                <div className="p-6">
                    <table className="w-full">
                        <thead>
                            <tr className="text-sm text-muted-foreground">
                                <th className="text-left font-medium">Member</th>
                                <th className="text-left font-medium">Role</th>
                                <th className="text-left font-medium">Status</th>
                                <th className="text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {TEAM_MEMBERS.map((member) => (
                                <tr key={member.id} className="text-sm">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={member.avatar || undefined} />
                                                <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{member.name}</div>
                                                <div className="text-muted-foreground">{member.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4">{member.role}</td>
                                    <td className="py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${member.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                                            }`}>
                                            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>Edit Role</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Invite Team Member</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <div className="flex gap-2">
                                <Input type="email" placeholder="colleague@company.com" />
                                <Button>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Send Invite
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
} 