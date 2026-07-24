import React from "react";

const ProfileMenuOpen = ({
  session,
  setProfileMenuOpen,
  signOut,
  router,
}: any) => { 
  return (
    <>
      <div
        className="fixed inset-0 z-50"
        onClick={() => setProfileMenuOpen(false)}
      />
      <div className="absolute right-10 top-10 mt-2 w-48 rounded-xl border border-slate-200 bg-lime-50 p-2 shadow-lg z-50 animate-in fade-in slide-in-from-top-2">
        <div className="px-3 py-2 border-b border-slate-100 mb-2">
          <p className="text-sm font-semibold text-slate-900 truncate">
            {session.user.name}
          </p>
          <p className="text-xs text-slate-500 truncate">
            {session.user.email}
          </p>
        </div>
        <button
          onClick={() => {
            setProfileMenuOpen(false);
            signOut({
              fetchOptions: { onSuccess: () => router.push("/") },
            });
          }}
          className="w-full hover:cursor-pointer flex items-center justify-start rounded-full px-3 py-2 text-sm font-medium text-slate-600 bg-red-100 hover:bg-red-200 hover:text-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default ProfileMenuOpen;
