"use client"
import { useUser } from "@/hooks/useUser";


const AccountName = () => {
      const { userDetails } = useUser();
  console.log(userDetails)
    return (
        <span className="line-clamp-3 text-left w-full break-words">
        <button className="bg-transparent border-none cursor-pointer w-full">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-[900] text-left capitalize ">
                {userDetails?.full_name}
            </h1>
        </button>
    </span>
    )
}

export default AccountName;