import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MemoryView from '@/pages/CreateWorkflow/MemoryView'
import WorkflowView from '@/pages/CreateWorkflow/WorkflowView'
import { Button } from '@/components/ui/button'
import { Brain, Bot, Save, Loader2 } from 'lucide-react'
import { Column, Workflow, workflowApi } from '@/lib/api'
import { useToast } from '@/components/ui/use-toast'

export default function CreateWorkflow() {
    const [activeView, setActiveView] = useState<'memory' | 'workflow'>('memory')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [workflow, setWorkflow] = useState<Workflow>({
        name: 'New Workflow',
        script: '',
        databaseColumns: []
    })
    const navigate = useNavigate()
    const { toast } = useToast()

    const handleMemoryUpdate = (name: string, columns: Column[]) => {
        setWorkflow(prev => ({
            ...prev,
            name,
            databaseColumns: columns
        }))
    }

    const handleScriptUpdate = (script: string) => {
        setWorkflow(prev => ({
            ...prev,
            script
        }))
    }

    const handleSave = async () => {
        if (!workflow.script) {
            toast({
                title: "Missing Script",
                description: "Please define a workflow script before saving.",
                variant: "destructive"
            })
            setActiveView('workflow')
            return
        }

        try {
            setIsSubmitting(true)
            const savedWorkflow = await workflowApi.createWorkflow(workflow)
            
            toast({
                title: "Workflow Created",
                description: `${savedWorkflow.name} has been successfully created.`
            })
            
            // Navigate to workflow list or details page
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
        <div className="h-full w-full space-y-6 p-4">
            <div className="flex justify-between items-start">
                <div className="flex gap-2 bg-muted p-1 rounded-lg">
                    <Button
                        variant={activeView === 'memory' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveView('memory')}
                        className="gap-2"
                    >
                        <Brain className="h-4 w-4" />
                        Memory & Knowledge
                    </Button>
                    <Button
                        variant={activeView === 'workflow' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveView('workflow')}
                        className="gap-2"
                    >
                        <Bot className="h-4 w-4" />
                        Workflow
                    </Button>
                </div>
                <Button 
                    onClick={handleSave} 
                    disabled={isSubmitting}
                    className="gap-2"
                >
                    {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4" />
                    )}
                    Save Workflow
                </Button>
            </div>

            <div className="h-[calc(100%-theme(space.6)-theme(space.16))]">
                {activeView === 'memory' ? (
                    <MemoryView 
                        workflowName={workflow.name} 
                        onUpdate={handleMemoryUpdate} 
                    />
                ) : (
                    <WorkflowView 
                        initialScript={workflow.script} 
                        onUpdate={handleScriptUpdate} 
                    />
                )}
            </div>
        </div>
    )
} 