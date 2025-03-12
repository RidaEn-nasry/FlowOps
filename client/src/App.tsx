import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DashboardSidebar from '@/components/DashboardSidebar'
import IntegrationsList from '@/pages/IntegrationsList'
import WorkflowList from '@/pages/WorkflowList'
import WorkflowCreate from '@/pages/WorkflowCreate'
import WorkflowDetail from '@/pages/WorkflowDetail'
import TeamManagement from '@/pages/TeamManagement'
import { useNavigate } from 'react-router-dom'

function AppRoutes() {
  const navigate = useNavigate()

  const handleSelectWorkflow = (id: string) => {
    navigate(`/workflow/${id}`)
  }

  return (
    <Routes>
      <Route path="/" element={<WorkflowList onSelectWorkflow={handleSelectWorkflow} />} />
      <Route path="/workflows" element={<WorkflowList onSelectWorkflow={handleSelectWorkflow} />} />
      <Route path="/integrations" element={<IntegrationsList />} />
      <Route path="/workflow/create" element={<WorkflowCreate />} />
      <Route path="/workflow/:id" element={<WorkflowDetail />} />
      <Route path="/team" element={<TeamManagement />} />
    </Routes>
  )
}

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <div className="w-1/6">
          <DashboardSidebar />
        </div>
        <main className="w-5/6">
          <div className="h-full">
            <AppRoutes />
          </div>
        </main>
      </div>
    </Router>
  )
}
