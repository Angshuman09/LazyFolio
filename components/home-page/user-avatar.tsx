'use client'

export function UserAvatar({ user }: { user: any }) {
  // console.log(user);
    return (
      <div className="flex items-center gap-2 cursor-pointer">
        {user.image ? (
          <img
            src={user.image}
            alt="avatar"
            className="w-9 h-9 rounded-full"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center">
            {user.name?.[0] || "U"}
          </div>
        )}
      </div>
    );
  }
  