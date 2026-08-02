'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="bg-(--lf-bg) flex flex-col justify-center items-center gap-5 w-full h-screen">
      <h1 className="font-bold text-9xl">404</h1>
      <h1 className="font-semibold text-4xl">Page Not Found</h1>
      <Button onClick={()=>router.push('/')} className="rounded-full py-7 px-6 cursor-pointer">Go home</Button>
    </div>
  )
}

export default NotFound