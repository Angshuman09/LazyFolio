import React from 'react'
import Navbar from "@/components/home-page/navbar";

const Main = ({children}:{children: React.ReactNode}) => {
  return (
    <div className="font-sans-body min-h-screen bg-(--lf-bg) text-(--lf-ink)">
        <Navbar />
        <main>{children}</main>
    </div>
  )
}

export default Main