import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Line, LineChart, ResponsiveContainer } from 'recharts'
import { useNavigate } from 'react-router-dom'

type Workflow = {
    id: string
    name: string
    description: string
    status: 'active' | 'inactive'
    lastRun?: string
    dotColor: string
    activityData: number[]
    cost?: string
    shape?: 'square' | 'circle' | 'hexagon' | 'triangle'
}

// Helper function to generate mock activity data
const generateActivityData = (type: "flat" | "varying") => {
    if (type === "flat") {
        return Array(50).fill(0.2)
    }
    return Array(50).fill(0).map(() => Math.random())
}

const mockWorkflows: Workflow[] = [
    {
        id: '1',
        name: 'Customer Support',
        description: 'Automated email responses',
        status: 'active',
        lastRun: '2m ago',
        dotColor: '#8B5CF6',
        activityData: generateActivityData("varying"),
        cost: '$0.50/m',
        shape: 'circle'
    },
    {
        id: '2',
        name: 'Lead Generation',
        description: 'LinkedIn analysis',
        status: 'active',
        lastRun: '1h ago',
        dotColor: '#1E293B',
        activityData: generateActivityData("flat"),
        cost: '$1.20/m',
        shape: 'square'
    },
    {
        id: '3',
        name: 'Content Curation',
        description: 'Social media analysis',
        status: 'inactive',
        dotColor: '#EC4899',
        activityData: generateActivityData("varying"),
        cost: '$0.75/m',
        shape: 'hexagon'
    },
]

// const ShapeIcon = ({ shape, color }: { shape: Workflow['shape']; color: string }) => {
//     const baseClasses = "w-8 h-8 transition-all"

//     switch (shape) {
//         case 'circle':
//             return (
//                 <div
//                     className={`${baseClasses} rounded-full bg-opacity-15`}
//                     style={{ backgroundColor: color, opacity: 0.15 }}
//                 />
//             )
//         case 'square':
//             return (
//                 <div
//                     className={`${baseClasses} rounded-md transform rotate-45 bg-opacity-15`}
//                     style={{ backgroundColor: color, opacity: 0.15 }}
//                 />
//             )
//         case 'hexagon':
//             return (
//                 <div
//                     className={`${baseClasses} clip-path-hexagon bg-opacity-15`}
//                     style={{
//                         backgroundColor: color,
//                         opacity: 0.15,
//                         clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
//                     }}
//                 />
//             )
//         default:
//             return (
//                 <div
//                     className={`${baseClasses} rounded bg-opacity-15`}
//                     style={{ backgroundColor: color, opacity: 0.15 }}
//                 />
//             )
//     }
// }

export default function WorkflowList({ onSelectWorkflow }: { onSelectWorkflow: (id: string) => void }) {
    const [workflows] = useState<Workflow[]>(mockWorkflows)
    const navigate = useNavigate()
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workflows.map((workflow) => (
                    <Card
                        key={workflow.id}
                        className="hover:bg-accent/5 transition-colors cursor-pointer"
                        onClick={() => onSelectWorkflow(workflow.id)}
                    >
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium">{workflow.name}</h3>
                                    <div className={`h-2 w-2 rounded-full ${workflow.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {workflow.description}
                                </p>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">
                                        {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
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
                                    <LineChart data={workflow.activityData.map((value, i) => ({ value, time: i }))}>
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            // light gray
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
        </div>
    )
}

