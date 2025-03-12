import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Workflow, Column, DatabaseDefinition, workflowApi, memoryApi } from '@/lib/api'
import { useToast } from '@/components/ui/use-toast'
import Editor from '@monaco-editor/react'
import { Loader2, Save, Trash2, Plus, X } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const COLUMN_TYPES = [
    { label: "Text", value: "text" },
    { label: "Number", value: "number" },
    { label: "Boolean", value: "boolean" },
    { label: "Date", value: "date" },
    { label: "Select", value: "select" },
    { label: "URL", value: "url" },
    { label: "Email", value: "email" },
    { label: "Rich Text", value: "rich_text" },
    { label: "File", value: "file" },
]

export default function WorkflowDetail() {
    const { id } = useParams<{ id: string }>()
    const [workflow, setWorkflow] = useState<Workflow | null>(null)
    const [name, setName] = useState('')
    const [script, setScript] = useState('')
    const [columns, setColumns] = useState<Column[]>([])
    const [databaseDefinitions, setDatabaseDefinitions] = useState<DatabaseDefinition[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const navigate = useNavigate()
    const { toast } = useToast()

    useEffect(() => {
        const fetchWorkflow = async () => {
            if (!id) return
            
            try {
                setIsLoading(true)
                const data = await workflowApi.getWorkflow(id)
                setWorkflow(data)
                setName(data.name)
                setScript(data.script)
                setColumns(data.databaseColumns || [])
                
                // Fetch database definitions for this workflow
                try {
                    const dbDefinitions = await memoryApi.getDatabaseDefinitionsByWorkflowId(id)
                    setDatabaseDefinitions(dbDefinitions)
                } catch (error) {
                    console.error('Error fetching database definitions:', error)
                }
            } catch (error) {
                console.error('Error fetching workflow:', error)
                toast({
                    title: "Error",
                    description: "Failed to fetch workflow details. Please try again.",
                    variant: "destructive"
                })
                navigate('/workflows')
            } finally {
                setIsLoading(false)
            }
        }

        fetchWorkflow()
    }, [id, navigate, toast])

    const handleSave = async () => {
        if (!id || !workflow) return
        
        if (!name.trim()) {
            toast({
                title: "Error",
                description: "Please provide a workflow name",
                variant: "destructive"
            })
            return
        }

        if (!script.trim()) {
            toast({
                title: "Error",
                description: "Please provide a workflow script",
                variant: "destructive"
            })
            return
        }

        try {
            setIsSaving(true)
            
            const updatedWorkflow: Workflow = {
                ...workflow,
                name: name.trim(),
                script: script.trim(),
                databaseColumns: columns
            }
            
            // Update the workflow using the API
            await workflowApi.updateWorkflow(id, updatedWorkflow)
            setWorkflow(updatedWorkflow)
            
            toast({
                title: "Success",
                description: "Workflow updated successfully",
            })
        } catch (error) {
            console.error('Error updating workflow:', error)
            toast({
                title: "Error",
                description: "Failed to update workflow. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!id) return
        
        try {
            setIsDeleting(true)
            await workflowApi.deleteWorkflow(id)
            
            toast({
                title: "Success",
                description: "Workflow deleted successfully",
            })
            
            navigate('/workflows')
        } catch (error) {
            console.error('Error deleting workflow:', error)
            toast({
                title: "Error",
                description: "Failed to delete workflow. Please try again.",
                variant: "destructive"
            })
            setIsDeleting(false)
        }
    }

    const addColumn = () => {
        setColumns([
            ...columns,
            {
                name: `Column ${columns.length + 1}`,
                type: 'text',
                required: false,
                options: []
            }
        ])
    }

    const updateColumn = (index: number, field: string, value: any) => {
        const updatedColumns = [...columns]
        updatedColumns[index] = {
            ...updatedColumns[index],
            [field]: value
        }
        setColumns(updatedColumns)
    }

    const removeColumn = (index: number) => {
        const updatedColumns = [...columns]
        updatedColumns.splice(index, 1)
        setColumns(updatedColumns)
    }

    const addOption = (columnIndex: number) => {
        const updatedColumns = [...columns]
        const column = updatedColumns[columnIndex]
        
        if (!column.options) {
            column.options = []
        }
        
        column.options.push({
            label: `Option ${column.options.length + 1}`
        })
        
        setColumns(updatedColumns)
    }

    const updateOption = (columnIndex: number, optionIndex: number, field: string, value: string) => {
        const updatedColumns = [...columns]
        const column = updatedColumns[columnIndex]
        
        if (column.options && column.options[optionIndex]) {
            column.options[optionIndex] = {
                ...column.options[optionIndex],
                [field]: value
            }
            
            setColumns(updatedColumns)
        }
    }

    const removeOption = (columnIndex: number, optionIndex: number) => {
        const updatedColumns = [...columns]
        const column = updatedColumns[columnIndex]
        
        if (column.options) {
            column.options.splice(optionIndex, 1)
            setColumns(updatedColumns)
        }
    }

    if (isLoading) {
        return (
            <div className="h-full flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!workflow) {
        return (
            <div className="h-full p-6">
                <div className="text-center">
                    <h1 className="text-2xl font-medium tracking-tight">Workflow not found</h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        The workflow you're looking for doesn't exist or has been deleted.
                    </p>
                    <Button 
                        className="mt-4" 
                        onClick={() => navigate('/workflows')}
                    >
                        Back to Workflows
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-medium tracking-tight">{workflow.name}</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage and edit your workflow
                    </p>
                </div>
                <div className="flex gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="gap-2 text-destructive">
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the
                                    workflow and all associated data.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                    onClick={handleDelete}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Deleting...
                                        </>
                                    ) : (
                                        "Delete"
                                    )}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    
                    <Button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className="gap-2"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="editor">
                <TabsList className="mb-4">
                    <TabsTrigger value="editor">Script</TabsTrigger>
                    <TabsTrigger value="database">Database Schema</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="logs">Logs</TabsTrigger>
                </TabsList>
                
                <TabsContent value="editor" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Workflow Script</CardTitle>
                            <CardDescription>
                                Edit your workflow script
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-md h-[500px]">
                                <Editor
                                    height="500px"
                                    defaultLanguage="javascript"
                                    value={script}
                                    onChange={(value) => setScript(value || '')}
                                    options={{
                                        minimap: { enabled: false },
                                        scrollBeyondLastLine: false,
                                        fontSize: 14,
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="database" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-start justify-between">
                            <div>
                                <CardTitle>Database Schema</CardTitle>
                                <CardDescription>
                                    Define the schema for your workflow's database
                                </CardDescription>
                            </div>
                            <Button 
                                size="sm" 
                                onClick={addColumn}
                                className="gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add Column
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {columns.length === 0 ? (
                                    <div className="text-center p-8 border border-dashed rounded-md bg-muted/30">
                                        <p className="text-muted-foreground mb-2">No columns defined yet</p>
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={addColumn}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add your first column
                                        </Button>
                                    </div>
                                ) : (
                                    columns.map((column, index) => (
                                        <Card key={index} className="relative border-dashed">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-2 h-6 w-6 text-muted-foreground"
                                                onClick={() => removeColumn(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                            
                                            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor={`col-name-${index}`}>Column Name</Label>
                                                    <Input
                                                        id={`col-name-${index}`}
                                                        value={column.name}
                                                        onChange={(e) => updateColumn(index, 'name', e.target.value)}
                                                    />
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <Label htmlFor={`col-type-${index}`}>Type</Label>
                                                    <Select
                                                        value={column.type}
                                                        onValueChange={(value) => updateColumn(index, 'type', value)}
                                                    >
                                                        <SelectTrigger id={`col-type-${index}`}>
                                                            <SelectValue placeholder="Select column type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {COLUMN_TYPES.map((type) => (
                                                                <SelectItem key={type.value} value={type.value}>
                                                                    {type.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center space-x-2">
                                                        <Switch
                                                            id={`col-required-${index}`}
                                                            checked={column.required || false}
                                                            onCheckedChange={(checked) => updateColumn(index, 'required', checked)}
                                                        />
                                                        <Label htmlFor={`col-required-${index}`}>Required</Label>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2 md:col-span-3">
                                                    <Label htmlFor={`col-description-${index}`}>Description</Label>
                                                    <Input
                                                        id={`col-description-${index}`}
                                                        value={column.description || ''}
                                                        onChange={(e) => updateColumn(index, 'description', e.target.value)}
                                                        placeholder="Optional description"
                                                    />
                                                </div>
                                                
                                                {column.type === 'select' && (
                                                    <div className="md:col-span-3 space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <Label>Options</Label>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => addOption(index)}
                                                                className="h-7 px-2 text-xs gap-1"
                                                            >
                                                                <Plus className="h-3 w-3" />
                                                                Add Option
                                                            </Button>
                                                        </div>
                                                        
                                                        <div className="space-y-2">
                                                            {column.options && column.options.length > 0 ? (
                                                                column.options.map((option, optionIndex) => (
                                                                    <div 
                                                                        key={optionIndex} 
                                                                        className="flex items-center gap-2"
                                                                    >
                                                                        <Input
                                                                            value={option.label}
                                                                            onChange={(e) => updateOption(index, optionIndex, 'label', e.target.value)}
                                                                            placeholder="Option label"
                                                                            className="flex-1"
                                                                        />
                                                                        <Input
                                                                            value={option.color || ''}
                                                                            onChange={(e) => updateOption(index, optionIndex, 'color', e.target.value)}
                                                                            placeholder="Color (hex)"
                                                                            className="w-32"
                                                                        />
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => removeOption(index, optionIndex)}
                                                                            className="h-8 w-8 text-muted-foreground"
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="text-center p-4 border border-dashed rounded-md bg-muted/30">
                                                                    <p className="text-muted-foreground text-sm">
                                                                        No options defined yet
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="settings" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Workflow Settings</CardTitle>
                            <CardDescription>
                                Configure your workflow settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Workflow Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter workflow name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            
                            {/* Additional settings can be added here */}
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="logs" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Workflow Logs</CardTitle>
                            <CardDescription>
                                View execution logs for this workflow
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-muted p-4 rounded-md h-[400px] overflow-auto">
                                <p className="text-muted-foreground text-center">
                                    No logs available yet
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <p className="text-xs text-muted-foreground">
                                Logs are retained for 30 days
                            </p>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
} 