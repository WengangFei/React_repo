
import FetchData from "./FetchData"

function App() {

  const countries:string[] = ['China','Japan','USA','RUA','Korea'];
  const fei = {name:'Fei',age:40}

  return (
    <>
      <FetchData countries={countries} {...fei}/>
    </>
  )
}

export default App
