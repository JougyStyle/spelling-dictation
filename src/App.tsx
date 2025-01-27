import DicteeApp from './components/dictee-app-updated'
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from "@vercel/analytics/react"


function App() {
  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <SpeedInsights />
      <Analytics />
      <DicteeApp />
    </div>
  )
}

export default App