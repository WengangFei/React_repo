import { Outlet,Navigate } from 'react-router-dom'


const AuthLayout = () => {
  const isAuthenticated = false;
  return (
    <>
     {
      isAuthenticated ? (<Navigate to="/" />) : (
        <>
        <section className="flex flex-1 justify-center items-center py-10">
          <Outlet />
        </section>
        <img src="/images/signup.jpg" alt="logo"
        className="hidden md:block h-screen w-1/2 object-cover bg-no-repeat"/>
        </>
      )
     }
    </>
  )
}

export default AuthLayout