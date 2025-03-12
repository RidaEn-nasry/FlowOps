import { useState, useEffect } from 'react'
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
    X,
    AlignLeft
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
        icon: <AlignLeft />,
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
        icon: <File />,
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
    const [name, setName] = useState(workflowName)
    const [isEditingName, setIsEditingName] = useState(false)
    const [columns, setColumns] = useState<Column[]>([])
    const [newColumn, setNewColumn] = useState<Partial<Column>>({
        name: "",
        type: "text",
        required: false
    })
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedColumnForOptions, setSelectedColumnForOptions] = useState<string | null>(null)
    const [newOption, setNewOption] = useState({ label: '', color: '' })
    const { toast } = useToast()

    // Add some sample row data to visualize the database
    const [rows] = useState<[]>([])

    useEffect(() => {
        onUpdate(name, columns)
    }, [name, columns, onUpdate])

    const addColumn = () => {
        if (!newColumn.name) return
        const column = {
            id: crypto.randomUUID(),
            name: newColumn.name,
            type: newColumn.type || "text",
            required: newColumn.required || false,
            options: newColumn.type === 'select' ? [] : undefined
        }
        const updatedColumns = [...columns, column]
        setColumns(updatedColumns)
        setNewColumn({ name: "", type: "text", required: false })
        setIsDialogOpen(false) // Close dialog after adding

        toast({
            title: "Column Added",
            description: `${column.name} column has been added to your database.`,
        })
    }

    const removeColumn = (id: string) => {
        setColumns(columns.filter(col => col.id !== id))
    }

    const handleNameChange = () => {
        setIsEditingName(false)
    }

    const openOptionsDialog = (columnId: string) => {
        setSelectedColumnForOptions(columnId)
    }

    const addOptionToColumn = () => {
        if (!selectedColumnForOptions || !newOption.label) return

        setColumns(columns.map(col => {
            if (col.id === selectedColumnForOptions) {
                const options = col.options || []
                return {
                    ...col,
                    options: [...options, { 
                        id: crypto.randomUUID(),
                        label: newOption.label,
                        color: newOption.color || undefined
                    }]
                }
            }
            return col
        }))

        setNewOption({ label: '', color: '' })
    }

    const removeOption = (columnId: string, optionId: string) => {
        setColumns(columns.map(col => {
            if (col.id === columnId && col.options) {
                return {
                    ...col,
                    options: col.options.filter(opt => opt.id !== optionId)
                }
            }
            return col
        }))
    }

    const getCellPlaceholder = (type: string) => {
        switch (type) {
            case 'text': 
                return 'Text';
            case 'long_text': 
                return 'Long text content...';
            case 'number': 
                return '123';
            case 'date': 
                return '2023-06-15';
            case 'select': 
                return 'Option';
            case 'multi_select': 
                return 'Option 1, Option 2';
            case 'boolean': 
                return 'Yes/No';
            case 'url': 
                return 'https://example.com';
            case 'file': 
                return 'file.pdf';
            default: 
                return '';
        }
    }

    return (
        <div className="h-full flex flex-col px-6 py-4">
            <div className="flex items-center gap-2 mb-6">
                {isEditingName ? (
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={handleNameChange}
                        onKeyDown={(e) => e.key === 'Enter' && handleNameChange()}
                        className="text-xl font-medium w-[300px]"
                        autoFocus
                    />
                ) : (
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-medium">{name || workflowName}</h1>
                        <Button variant="ghost" size="sm" onClick={() => setIsEditingName(true)}>
                            <Pencil className="h-3 w-3" />
                        </Button>
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        <h2 className="font-medium">Database Schema</h2>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
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
                                                        {React.cloneElement(type.icon, { className: 'h-4 w-4' })}
                                                        <span>{type.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">
                                        {columnTypes.find(t => t.id === newColumn.type)?.description}
                                    </p>
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

                <div className="border rounded-md overflow-auto flex-1">
                    <div className="min-w-[800px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16 border-r">#</TableHead>
                                    {columns.map((column) => (
                                        <TableHead 
                                            key={column.id} 
                                            className="min-w-[140px] border-r"
                                        >
                                            <div className="flex items-center justify-between gap-1">
                                                <div className="flex items-center gap-1.5">
                                                    {getColumnIcon(column.type)}
                                                    <span className="font-medium text-sm">{column.name}</span>
                                                    {column.required && <span className="text-destructive text-sm">*</span>}
                                                </div>
                                                <div className="flex gap-1">
                                                    {column.type === 'select' && (
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="h-6 w-6 p-0"
                                                            onClick={() => openOptionsDialog(column.id!)}
                                                        >
                                                            <List className="h-3 w-3" />
                                                        </Button>
                                                    )}
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                                        onClick={() => removeColumn(column.id!)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="text-[10px] text-muted-foreground">
                                                {column.type}
                                            </div>
                                        </TableHead>
                                    ))}
                                    {columns.length === 0 && (
                                        <TableHead className="text-center text-muted-foreground h-16">
                                            Click "Add Column" to start building your database schema
                                        </TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell className="border-r font-medium">{row.id}</TableCell>
                                        {columns.map((column) => (
                                            <TableCell 
                                                key={`${row.id}-${column.id}`}
                                                className="border-r text-muted-foreground text-sm"
                                            >
                                                {getCellPlaceholder(column.type)}
                                            </TableCell>
                                        ))}
                                        {columns.length === 0 && (
                                            <TableCell>
                                                No data
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                                {columns.length > 0 && (
                                    <TableRow>
                                        <TableCell className="border-r font-medium text-muted-foreground">+ New</TableCell>
                                        {columns.map((column) => (
                                            <TableCell 
                                                key={`new-${column.id}`}
                                                className="border-r text-muted-foreground"
                                            >
                                                <div className="h-6 w-full bg-muted/30 rounded-sm"></div>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Brain className="h-5 w-5" />
                            <h2 className="font-medium">Workflow Knowledge</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {memoryTypes.map((type) => (
                            <Card key={type.id} className="p-3 hover:bg-accent cursor-pointer transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-md">
                                        {React.cloneElement(type.icon, { className: 'h-4 w-4 text-primary' })}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium">{type.name}</h4>
                                        <p className="text-xs text-muted-foreground">{type.description}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Options Dialog for Select Columns */}
            <Dialog 
                open={!!selectedColumnForOptions} 
                onOpenChange={(open) => !open && setSelectedColumnForOptions(null)}
            >
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>
                            Options for {columns.find(c => c.id === selectedColumnForOptions)?.name}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Input
                                    value={newOption.label}
                                    onChange={(e) => setNewOption({ ...newOption, label: e.target.value })}
                                    placeholder="Option label"
                                />
                                <Input
                                    value={newOption.color}
                                    onChange={(e) => setNewOption({ ...newOption, color: e.target.value })}
                                    placeholder="Color (hex)"
                                    className="w-24"
                                />
                                <Button
                                    size="sm"
                                    onClick={addOptionToColumn}
                                    disabled={!newOption.label}
                                >
                                    <Plus className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {selectedColumnForOptions && (
                                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                    {columns.find(c => c.id === selectedColumnForOptions)?.options?.map(option => (
                                        <div key={option.id} className="flex items-center justify-between bg-muted p-2 rounded-md">
                                            <div className="flex items-center gap-2">
                                                {option.color && (
                                                    <div 
                                                        className="w-3 h-3 rounded-full" 
                                                        style={{ backgroundColor: option.color }} 
                                                    />
                                                )}
                                                <span>{option.label}</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0"
                                                onClick={() => selectedColumnForOptions && removeOption(selectedColumnForOptions, option.id!)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                    {!columns.find(c => c.id === selectedColumnForOptions)?.options?.length && (
                                        <div className="text-center p-4 text-muted-foreground">
                                            No options defined yet
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function getColumnIcon(type: string) {
    const columnType = columnTypes.find(t => t.id === type)
    return columnType ? React.cloneElement(columnType.icon, { className: "h-4 w-4" }) : <FileText className="h-4 w-4" />
}