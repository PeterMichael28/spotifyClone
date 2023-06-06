import Link from 'next/link';
import React from 'react'
import { IconType } from 'react-icons';
import { twMerge } from 'tailwind-merge';

type Props = {
    icon: IconType;
    label: string;
    active?: boolean;
    href: string;
}

const SideBarItem = ({icon:Icon, label, active, href}: Props) => {
  return (
    <Link href={href} className={twMerge('flex flex-row h-auto items-center w-full gap-x-4 text-md font-medium cursor-pointer hover:text-white transition text-neutral-500 duration-300 py-1', active && 'text-white')}>
          <Icon size={ 26 } />
          <p className='truncate w-100'>{ label }</p>
    </Link>
  )
}

export default SideBarItem