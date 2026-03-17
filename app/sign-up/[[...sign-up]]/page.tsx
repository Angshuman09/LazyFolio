import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#F5F2EB] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle background blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-[340px] h-[340px] rounded-full bg-[#e0d9c8] blur-[100px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full bg-[#d4e8dc] blur-[100px] opacity-50 pointer-events-none" />

      <div className="relative z-10 w-full flex flex-col items-center gap-6">
        {/* Logo above the form */}
        <div className="text-center mb-2">
          <p className="font-display text-3xl font-bold tracking-tight text-[#1a1a1a]">
            Lazyfolio
          </p>
          <p className="text-sm text-[#888] mt-1">
            Create your profession portfolio
          </p>
        </div>

        {/* Clerk SignUp with appearance overrides */}
        <SignUp
          appearance={{
            variables: {
              colorPrimary: "#1a1a1a",
              colorBackground: "#ffffff",
              colorText: "#1a1a1a",
              colorTextSecondary: "#666666",
              colorInputBackground: "#faf9f6",
              colorInputText: "#1a1a1a",
              borderRadius: "12px",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "14px",
            },
            elements: {
              card: "shadow-none border border-black/[0.07] rounded-2xl",
              headerTitle: "font-bold text-[#1a1a1a]",
              headerSubtitle: "text-[#888]",
              formButtonPrimary:
                "bg-[#1a1a1a] hover:opacity-80 transition-opacity rounded-full text-[#F5F2EB] text-sm font-medium",
              formFieldInput:
                "border border-black/[0.1] bg-[#faf9f6] rounded-xl text-sm focus:ring-1 focus:ring-[#1a1a1a] focus:border-[#1a1a1a]",
              footerActionLink: "text-[#1a1a1a] font-medium hover:underline",
              identityPreviewText: "text-[#1a1a1a]",
              dividerLine: "bg-black/[0.07]",
              dividerText: "text-[#aaa] text-xs",
            },
          }}
        />
      </div>
    </div>
  );
}
