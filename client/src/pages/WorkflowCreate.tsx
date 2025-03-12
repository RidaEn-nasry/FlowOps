import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Workflow, Column, workflowApi } from '@/lib/api'
import { useToast } from '@/components/ui/use-toast'
import Editor from '@monaco-editor/react'
import { Loader2, Plus, X, Database, Code } from 'lucide-react'
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

export default function WorkflowCreate() {
    const [name, setName] = useState('New Workflow')
    const [script, setScript] = useState('// Write your workflow script here\n\n')
    const [columns, setColumns] = useState<Column[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [activeTab, setActiveTab] = useState<string>('database')
    const navigate = useNavigate()
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
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
            setActiveTab('script')
            return
        }

        try {
            setIsSubmitting(true)
            
            const newWorkflow: Workflow = {
                name: name.trim(),
                script: script.trim(),
                databaseColumns: columns
            }
            
            await workflowApi.createWorkflow(newWorkflow)
            
            toast({
                title: "Success",
                description: "Workflow created successfully",
            })
            
            navigate('/workflows')
        } catch (error) {
            console.error('Error creating workflow:', error)
            toast({
                title: "Error",
                description: "Failed to create workflow. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
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

    return (
        <div className="h-full p-6">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-medium tracking-tight">Create Workflow</h1>
                    <p className="text-sm text-muted-foreground">
                        Create a new automated workflow
                    </p>
                </div>
                <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        'Create Workflow'
                    )}
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-[calc(100vh-180px)]">
                <TabsList className="mb-4">
                    <TabsTrigger value="database" className="gap-2">
                        <Database className="h-4 w-4" />
                        Database Schema
                    </TabsTrigger>
                    <TabsTrigger value="script" className="gap-2">
                        <Code className="h-4 w-4" />
                        Script
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="database" className="h-full">
                    <Card className="h-full flex flex-col">
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
                        <CardContent className="flex-1 overflow-auto">
                            <div className="space-y-4 mb-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Workflow Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter workflow name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

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
                        <CardFooter className="flex justify-between">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => navigate('/workflows')}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="button" 
                                onClick={() => setActiveTab('script')}
                            >
                                Continue to Script
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="script" className="h-full">
                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <CardTitle>Workflow Script</CardTitle>
                            <CardDescription>
                                Write the code that will be executed when this workflow runs
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="border rounded-md h-full">
                                <Editor
                                    height="100%"
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
                        <CardFooter className="flex justify-between">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setActiveTab('database')}
                            >
                                Back to Database
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                onClick={handleSubmit}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Workflow'}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
} 