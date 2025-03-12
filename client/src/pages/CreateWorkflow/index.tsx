import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Database, FileCode2, Save } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import MemoryView from './MemoryView'
import WorkflowView from './WorkflowView'
import { Workflow, Column, workflowApi } from '@/lib/api'

export default function CreateWorkflow() {
    const [activeView, setActiveView] = useState<string>('memory')
    const [workflowName, setWorkflowName] = useState<string>('')
    const [columns, setColumns] = useState<Column[]>([])
    const [script, setScript] = useState<string>('')
    const { toast } = useToast()
    const navigate = useNavigate()

    const handleSaveWorkflow = async () => {
        try {
            if (!workflowName.trim()) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Please provide a workflow name'
                })
                return
            }

            if (columns.length === 0) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Please add at least one column to your database schema'
                })
                return
            }

            if (!script.trim()) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Please provide a workflow script'
                })
                return
            }

            const newWorkflow: Workflow = {
                name: workflowName,
                script: script.trim(),
                databaseColumns: columns
            }

            await workflowApi.createWorkflow(newWorkflow)
            
            toast({
                title: 'Success',
                description: 'Workflow created successfully'
            })
            
            navigate('/workflows')
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to create workflow'
            })
            console.error(error)
        }
    }

    const handleMemoryUpdate = (name: string, updatedColumns: Column[]) => {
        setWorkflowName(name)
        setColumns(updatedColumns)
    }

    return (
        <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-between border-b px-6">
                <h1 className="text-xl font-semibold">Create New Workflow</h1>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="secondary" 
                        onClick={() => navigate('/workflows')}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSaveWorkflow}
                    >
                        <Save className="mr-2 h-4 w-4" />
                        Save Workflow
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="border-b px-6 py-3">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setActiveView('memory')}
                            className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                activeView === 'memory'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted'
                            }`}
                        >
                            <Database className="h-4 w-4" />
                            <span>Memory & Knowledge</span>
                        </button>
                        <button
                            onClick={() => setActiveView('workflow')}
                            className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                activeView === 'workflow'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted'
                            }`}
                        >
                            <FileCode2 className="h-4 w-4" />
                            <span>Workflow</span>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    {activeView === 'memory' && (
                        <MemoryView
                            workflowName={workflowName}
                            onUpdate={handleMemoryUpdate}
                        />
                    )}
                    {activeView === 'workflow' && (
                        <WorkflowView
                            initialScript={script}
                            onUpdate={setScript}
                        />
                    )}
                </div>
            </div>
        </div>
    )
} 