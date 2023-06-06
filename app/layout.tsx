import SideBar from '@/components/SideBar';
import './globals.css'
import { Figtree } from 'next/font/google'
import SupabaseProvider from '@/providers/SupabaseProvider';
import UserProvider from '@/providers/UserProvider';
import ModalProvider from '@/providers/ModalProvider';
import ToasterProvider from '@/providers/ToasterProvider';
import getSongsByUserId from '@/actions/getSongsByUserId';
import Player from '@/components/Player';
import getActiveProductsWithPrices from '@/actions/getActiveProductsWithPrices';

const figtree = Figtree({ subsets: ['latin'] })

export const metadata = {
  title: 'SpotifyClone',
  description: 'Listen to Music',
}

export const revalidate = 0;
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userSongs = await getSongsByUserId();
  const products = await getActiveProductsWithPrices();



  return (
    <html lang="en">
      <body className={ figtree.className }>
          <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
          <ModalProvider products={products} />
        <SideBar songs={userSongs}>
        { children }
        </SideBar>
        <Player />
        </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
