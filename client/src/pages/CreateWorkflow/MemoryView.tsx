import { useState } from 'react'
import React from 'react'
import {
    Plus,
    Table2,
    FileText,
    Link2,
    Grip,
    Brain,
    Database,
    Calendar,
    Pencil,
    List,
    ToggleRight,
    MessageSquare,
    Network,
    FolderOpen,
    Hash,
    ListChecks,
    File,
    Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Column } from '@/lib/api'
import { useToast } from '@/components/ui/use-toast'

interface MemoryViewProps {
    workflowName: string;
    onUpdate: (name: string, columns: Column[]) => void;
}

const columnTypes = [
    {
        id: 'text',
        name: 'Short Text',
        icon: <FileText />,
        description: 'Names, titles, short descriptions'
    },
    {
        id: 'long_text',
        name: 'Long Text',
        icon: <FileText />,
        description: 'Paragraphs, long descriptions, JSON'
    },
    {
        id: 'number',
        name: 'Number',
        icon: <Hash />,
        description: 'Integers, decimals, quantities'
    },
    {
        id: 'date',
        name: 'Date & Time',
        icon: <Calendar />,
        description: 'Dates, timestamps, schedules'
    },
    {
        id: 'select',
        name: 'Single Select',
        icon: <List />,
        description: 'Choose one from options'
    },
    {
        id: 'multi_select',
        name: 'Multi Select',
        icon: <ListChecks />,
        description: 'Choose multiple from options'
    },
    {
        id: 'boolean',
        name: 'True/False',
        icon: <ToggleRight />,
        description: 'Yes/no, on/off states'
    },
    {
        id: 'url',
        name: 'URL',
        icon: <Link2 />,
        description: 'Web links, media links'
    },
    {
        id: 'file',
        name: 'File',
        icon: < File />,
        description: 'Files, images, videos'
    }

]

const memoryTypes = [
    {
        id: 'context-store',
        name: 'Context Store',
        icon: <Brain className="h-5 w-5" />,
        description: 'Long-term contextual memory for conversations'
    },
    {
        id: 'knowledge-base',
        name: 'Knowledge Base',
        icon: <Database className="h-5 w-5" />,
        description: 'Company docs, FAQs, product info'
    },
    {
        id: 'conversation-history',
        name: 'Conversation History',
        icon: <MessageSquare className="h-5 w-5" />,
        description: 'Past interactions and chat logs'
    },
    {
        id: 'vector-embeddings',
        name: 'Vector Embeddings',
        icon: <Network className="h-5 w-5" />,
        description: 'Semantic search and similarity matching'
    },
    {
        id: 'structured-data',
        name: 'Structured Data',
        icon: <Table2 className="h-5 w-5" />,
        description: 'Databases and organized information'
    },
    {
        id: 'file-storage',
        name: 'File Storage',
        icon: <FolderOpen className="h-5 w-5" />,
        description: 'Document and media storage'
    }
]

export default function MemoryView({ workflowName, onUpdate }: MemoryViewProps) {
    const [isEditingName, setIsEditingName] = useState(false)
    const [localWorkflowName, setLocalWorkflowName] = useState(workflowName)
    const [columns, setColumns] = useState<Column[]>([])
    const [newColumn, setNewColumn] = useState<Partial<Column>>({
        name: "",
        type: "text",
        required: false
    })
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const addColumn = () => {
        if (!newColumn.name) return
        const column = {
            id: crypto.randomUUID(),
            name: newColumn.name,
            type: newColumn.type || "text",
            required: newColumn.required || false
        }
        const updatedColumns = [...columns, column]
        setColumns(updatedColumns)
        setNewColumn({ name: "", type: "text", required: false })
        setIsDialogOpen(false) // Close dialog after adding

        // Update parent component
        onUpdate(localWorkflowName, updatedColumns)

        toast({
            title: "Column Added",
            description: `${column.name} column has been added to your database definition.`,
        })
    }

    const handleNameChange = () => {
        setIsEditingName(false)
        // Update parent component
        onUpdate(localWorkflowName, columns)
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 mb-2">
                {isEditingName ? (
                    <Input
                        value={localWorkflowName}
                        onChange={(e) => setLocalWorkflowName(e.target.value)}
                        onBlur={handleNameChange}
                        onKeyDown={(e) => e.key === 'Enter' && handleNameChange()}
                        className="text-xl font-medium w-[300px]"
                        autoFocus
                    />
                ) : (
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-medium">{localWorkflowName}</h1>
                        <Button variant="ghost" size="sm" onClick={() => setIsEditingName(true)}>
                            <Pencil className="h-3 w-3" />
                        </Button>
                    </div>
                )}
            </div>

            <div className="border-b py-2 px-4 flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Table2 className="h-4 w-4" />
                    <span className="font-medium text-sm">Database Structure</span>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm">
                            <Plus className="h-3 w-3 mr-1" />
                            Add Column
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                            <DialogTitle>Add New Column</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label>Column Name</Label>
                                <Input
                                    value={newColumn.name}
                                    onChange={(e) => setNewColumn({ ...newColumn, name: e.target.value })}
                                    placeholder="Enter column name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Column Type</Label>
                                <Select
                                    value={newColumn.type}
                                    onValueChange={(value) => setNewColumn({ ...newColumn, type: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {columnTypes.map(type => (
                                            <SelectItem key={type.id} value={type.id}>
                                                <div className="flex items-center gap-2">
                                                    {type.icon}
                                                    <span>{type.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={newColumn.required}
                                    onCheckedChange={(checked) => setNewColumn({ ...newColumn, required: checked })}
                                />
                                <Label>Required</Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={addColumn} className="w-full">Add Column</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-4">
                <div className="col-span-9">
                    <Table className="w-full border">
                        <TableHeader>
                            <TableRow className="w-full">
                                <TableCell className="w-[32px] py-2">
                                    <Grip className="h-3 w-3 text-muted-foreground" />
                                </TableCell>
                                {columns.length > 0 ? (
                                    columns.map((column) => (
                                        <TableHead key={column.id} className="py-2">
                                            <div className="flex items-center gap-1.5">
                                                {getColumnIcon(column.type)}
                                                <div>
                                                    <div className="font-medium text-sm">{column.name}</div>
                                                    <div className="text-[10px] text-muted-foreground">{column.type}</div>
                                                </div>
                                            </div>
                                        </TableHead>
                                    ))
                                ) : (
                                    <TableCell colSpan={2} className="text-center text-muted-foreground text-sm py-8">
                                        No columns defined. Click "Add Column" to start building your database.
                                    </TableCell>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + 1}
                                    className="h-[160px] text-center text-muted-foreground text-sm"
                                >
                                    {isLoading ? (
                                        <div className="flex justify-center items-center h-full">
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                        </div>
                                    ) : (
                                        "No data"
                                    )}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                <div className="col-span-3">
                    <div className="bg-card rounded-lg border p-3">
                        <h3 className="text-sm font-medium mb-3">Add Workflow Knowledge</h3>
                        <div className="space-y-2">
                            {memoryTypes.map((type) => (
                                <Card key={type.id} className="p-2 hover:bg-accent cursor-pointer transition-colors">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-primary/10 rounded-md">
                                            {React.cloneElement(type.icon, { className: 'h-4 w-4' })}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium">{type.name}</h4>
                                            <p className="text-[10px] text-muted-foreground">{type.description}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function getColumnIcon(type: string) {
    const columnType = columnTypes.find(t => t.id === type)
    return columnType ? React.cloneElement(columnType.icon, { className: "h-4 w-4" }) : null
} 