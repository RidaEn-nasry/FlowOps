import { useState } from 'react'
import MemoryView from '@/pages/CreateWorkflow/MemoryView'
import WorkflowView from '@/pages/CreateWorkflow/WorkflowView'
import { Button } from '@/components/ui/button'
import { Brain, Bot } from 'lucide-react'

export default function CreateWorkflow() {
    const [activeView, setActiveView] = useState<'memory' | 'workflow'>('memory')

    return (
        <div className="h-full w-full space-y-6 p-4">
            <div className="flex justify-end items-start">
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
            </div>

            <div className="h-[calc(100%-theme(space.6)-theme(space.16))]">
                {activeView === 'memory' ? <MemoryView /> : <WorkflowView />}
            </div>
        </div>
    )
} 