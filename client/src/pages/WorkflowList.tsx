import { useState, useEffect } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Line, LineChart, ResponsiveContainer } from 'recharts'
import { useNavigate } from 'react-router-dom'
import { Workflow, workflowApi } from '@/lib/api'
import { useToast } from '@/components/ui/use-toast'

// Helper function to generate mock activity data
const generateActivityData = (type: "flat" | "varying") => {
    if (type === "flat") {
        return Array(50).fill(0.2)
    }
    return Array(50).fill(0).map(() => Math.random())
}

export default function WorkflowList({ onSelectWorkflow }: { onSelectWorkflow: (id: string) => void }) {
    const [workflows, setWorkflows] = useState<Workflow[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const { toast } = useToast()

    // Fetch workflows from API
    useEffect(() => {
        const fetchWorkflows = async () => {
            try {
                setIsLoading(true)
                const data = await workflowApi.getAllWorkflows()
                
                // Add activity data for visualization
                const processedWorkflows = data.map(workflow => ({
                    ...workflow,
                    dotColor: getRandomColor(),
                    activityData: generateActivityData(Math.random() > 0.5 ? "varying" : "flat"),
                    status: 'active' as 'active' | 'inactive',
                    cost: `$${(Math.random() * 5).toFixed(2)}/m`
                }))
                
                setWorkflows(processedWorkflows)
            } catch (error) {
                console.error('Error fetching workflows:', error)
                toast({
                    title: "Error",
                    description: "Failed to fetch workflows. Please try again.",
                    variant: "destructive"
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchWorkflows()
    }, [toast])

    // Generate a random color
    function getRandomColor() {
        const colors = ['#8B5CF6', '#1E293B', '#EC4899', '#10B981', '#6366F1', '#F59E0B']
        return colors[Math.floor(Math.random() * colors.length)]
    }

    return (
        <div className="h-full p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-medium tracking-tight">Workflows</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage and monitor your automated workflows
                    </p>
                </div>
                <Button onClick={() => { navigate('/workflow/create') }} size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Workflow
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : workflows.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-[400px] bg-muted/40 rounded-lg border border-dashed">
                    <p className="text-lg text-muted-foreground mb-4">No workflows found</p>
                    <Button onClick={() => { navigate('/workflow/create') }} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Create your first workflow
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {workflows.map((workflow) => (
                        <Card
                            key={workflow.id}
                            className="hover:bg-accent/5 transition-colors cursor-pointer"
                            onClick={() => onSelectWorkflow(workflow.id!)}
                        >
                            <div className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-medium">{workflow.name}</h3>
                                        <div className={`h-2 w-2 rounded-full ${workflow.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {workflow.script.length > 100 
                                            ? workflow.script.substring(0, 100) + '...' 
                                            : workflow.script}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">
                                            {workflow.status ? workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1) : 'Active'}
                                        </span>
                                    </div>
                                    {workflow.cost && (
                                        <span className="text-muted-foreground font-medium">
                                            {workflow.cost}
                                        </span>
                                    )}
                                </div>

                                <div className="h-[60px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={workflow.activityData?.map((value, i) => ({ value, time: i }))}>
                                            <Line
                                                type="monotone"
                                                dataKey="value"
                                                stroke="#e2e8f0"
                                                strokeWidth={1.5}
                                                dot={false}
                                                className="text-primary/50"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

