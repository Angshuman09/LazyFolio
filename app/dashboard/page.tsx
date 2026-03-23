import { getOrCreateUser } from "@/lib/getOrCreateUser"
import { Sidebar } from "lucide-react"
import { redirect } from "next/navigation"

const Dashboard = async () => {

  return (
    <div className='bg-red-300 w-full h-screen'>
      <Sidebar/>
      hello
    </div>
  )
}

export default Dashboard