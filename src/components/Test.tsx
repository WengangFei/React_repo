import Logo from '../assets/react.svg'



const Test = () => {

  return (
    <>
        <header>
            <nav>
                <img src={Logo} alt="logo" />
                <span className='title'>ReactFacts</span>
                <div className='title_div'>
                    <p>Home</p>
                    <p>About</p>
                    <p>Contact</p>
                </div>
            </nav>
        </header>
       
       <main>
        <ul>
            <li>This is cool</li>
            <li>What is not cool.</li>
        </ul>
       </main>
    
        <footer>
            <p>&copy; 2023 Copyright React Practice</p>
        </footer>
    </>
    
  )
}

export default Test