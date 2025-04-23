import BottomBar from '@/components/shared/BottomBar'
import LeftSideBar from '@/components/shared/LeftSideBar'
import TopBar from '@/components/shared/TopBar'
import { Outlet } from 'react-router-dom'


const RootLayout = () => {
  return (
    <div className='w-full md:flex'>
      <TopBar />
      <LeftSideBar />
        <div>
          
        </div>
      <section className='flex flex-1 h-full lg:max-w-5xl'> 
        <Outlet />
      </section>
      <BottomBar />
    </div>
  )
}

export default RootLayout