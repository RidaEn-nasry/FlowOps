import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DashboardSidebar from '@/components/DashboardSidebar'
import IntegrationsList from '@/pages/IntegrationsList'
import WorkflowList from '@/pages/WorkflowList'
import CreateWorkflow from '@/pages/CreateWorkflow'
import TeamManagement from '@/pages/TeamManagement'

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <div className="w-1/6">
          <DashboardSidebar />
        </div>
        <main className="w-5/6">
          <div className="h-full">
            <Routes>
              <Route path="/workflows" element={<WorkflowList onSelectWorkflow={() => { }} />} />
              <Route path="/integrations" element={<IntegrationsList />} />
              <Route path="/workflow/create" element={<CreateWorkflow />} />
              <Route path="/team" element={<TeamManagement />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  )
}
