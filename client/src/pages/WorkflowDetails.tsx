import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs'

export default function WorkflowDetails({ workflowId, onBack }: { workflowId: string; onBack: () => void }) {
    const workflow = {
        id: workflowId,
        name: 'Data Processor',
        activity: 'Processing sales data',
        status: 'active',
    }
    return (
        <div className="space-y-6">
            <Button variant="ghost" onClick={onBack} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Agents
            </Button>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{workflow.name}</h1>
                <Button variant="outline">Edit Workflow</Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Workflow Details</CardTitle>
                    <CardDescription>{workflow.activity}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Status: <span className={workflow.status === 'active' ? 'text-green-600' : 'text-red-600'}>
                        {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                    </span></p>
                </CardContent>
            </Card>
            <Tabs defaultValue="activity">
                <TabsList>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="database">Database</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="activity">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Display recent workflow activity here...</p>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="database">
                    <Card>
                        <CardHeader>
                            <CardTitle>Database</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Display workflow database information here...</p>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="history">
                    <Card>
                        <CardHeader>
                            <CardTitle>History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Display workflow history here...</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

