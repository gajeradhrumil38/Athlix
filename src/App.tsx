import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Home } from '@/pages/Home'
import { Workout } from '@/pages/Workout'
import { Calendar } from '@/pages/Calendar'
import { Dashboard } from '@/pages/Dashboard'
import { Library } from '@/pages/Library'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/library" element={<Library />} />
        </Route>
        <Route path="/workout" element={<Workout />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
