import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Workflow, workflowApi } from '@/lib/api'
import { useToast } from '@/components/ui/use-toast'
import Editor from '@monaco-editor/react'

export default function WorkflowCreate() {
    const [name, setName] = useState('')
    const [script, setScript] = useState('// Write your workflow script here\n\n')
    const [isSubmitting, setIsSubmitting] = useState(false)
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
            return
        }

        try {
            setIsSubmitting(true)
            
            const newWorkflow: Workflow = {
                name: name.trim(),
                script: script.trim()
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

    return (
        <div className="h-full p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-medium tracking-tight">Create Workflow</h1>
                <p className="text-sm text-muted-foreground">
                    Create a new automated workflow
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="max-w-4xl">
                    <CardHeader>
                        <CardTitle>Workflow Details</CardTitle>
                        <CardDescription>
                            Provide the basic information for your workflow
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
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

                        <div className="space-y-2">
                            <Label htmlFor="script">Workflow Script</Label>
                            <div className="border rounded-md h-[400px]">
                                <Editor
                                    height="400px"
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
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Workflow'}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
} 