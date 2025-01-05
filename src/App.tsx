import DicteeApp from './components/dictee-app-updated'
import { SpeedInsights } from "@vercel/speed-insights/next"
function App() {
  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <SpeedInsights />
      <DicteeApp />
    </div>
  )
}

export default App