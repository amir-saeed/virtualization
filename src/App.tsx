import AdvancedTable from "./components/AdvancedTable";
import VirtualizedTable from "./components/BasicVirualizedTable";
import AdvancedVirtualizedTable from "./components/AdvancedVirtualizedTable";

export default function App() {
  return (
    <main className="min-h-screen grid place-items-center bg-gray-50">
     <AdvancedTable />
     <VirtualizedTable />
     <AdvancedVirtualizedTable />
    </main>
  )
}
