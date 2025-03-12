import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Workflow, workflowApi } from '@/lib/api'
import { useToast } from '@/components/ui/use-toast'
import Editor from '@monaco-editor/react'
import { Loader2, Save, Trash2 } from 'lucide-react'
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

export default function WorkflowDetail() {
    const { id } = useParams<{ id: string }>()
    const [workflow, setWorkflow] = useState<Workflow | null>(null)
    const [name, setName] = useState('')
    const [script, setScript] = useState('')
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
                script: script.trim()
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
                    <TabsTrigger value="editor">Editor</TabsTrigger>
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