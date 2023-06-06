import Header from "@/components/Header";

import AccountContent from "@/components/AccountContent";
import AccountName from "@/components/AccountName";
import { SlUser } from "react-icons/sl";
import getSongsByUserId from '@/actions/getSongsByUserId';
import PageContent from "@/components/PageContent";

const Account = async () => {
  const userSongs = await getSongsByUserId();

  return (
    <div 
      className="
        bg-[#121212] 
        rounded-[8px] 
        h-full 
        w-full 
        overflow-hidden 
        overflow-y-auto
        relative
      "
    >
  
        <div className="account w-full items-end h-[38vh] md:h-[45vh]">
              <div className="f-abs h-full w-full absolute left-0 top-0 z-10"></div>
                  <div className="relative w-full flex z-20 items-center ">
                      {/* profile image */}
                      <div className="profile-picture h-[132px] min-w-[132px] w-[132px] sm:h-[162px] sm:min-w-[162px] sm:w-[162px] md:h-[192px] md:min-w-[192px] md:w-[192px] mx-6 lg:h-[232px] lg:min-w-[232px] lg:w-[232px]">
                          <div className="flex relative h-full">
                              <div className="rounded-full flex items-center justify-center bg-[#282828] text-[#7f7f7f] h-full w-full circle-div">
                                  <SlUser className='h-[48px] min-w-[48px] w-[48px] lg:h-[64px] lg:min-w-[64px] lg:w-[64px]'/>
                              </div>
                          </div>
                      </div>

                        {/* user details */}
                      <div className="flex-1 flex flex-col justify-end ">
                          <span className="text-[0.875rem] font-bold w-full">
                              Profile
                          </span>

                         <AccountName />

                          <div className="flex items-center flex-wrap">
                              <span className='text-[0.875rem] text-left'>1 Public Playlist</span>
                          </div>
                      </div>
                  </div>
        </div>


      <Header className="from-bg-neutral-900 " account>
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-semibold">
            Account Settings
          </h1>
        </div>
      </Header>
      <AccountContent />
      <div className="mt-7 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">Uploaded Songs</h1>
        </div>

        <PageContent songs={userSongs} />
      </div>
    </div>
  )
}

export default Account;