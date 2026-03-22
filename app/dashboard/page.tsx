import { getOrCreateUser } from "@/lib/getOrCreateUser"
import { redirect } from "next/navigation"

const Dashboard = async () => {
  const user = await getOrCreateUser();
  if(!user) redirect("/sign-in");

    if (!user.onboarded) {
    redirect("/user-detail")
  }
  
  return (
    <div className='bg-red-300 w-full h-screen'>Dashboard</div>
  )
}

export default Dashboard