import { useState, createContext } from "react"
import Drinks from "./Drinks";

interface GlobalType {
    name:string,
    age:number,
}
type F = {
    fei:GlobalType,
    color:string
}
export const GlobalContext = createContext<F|null>(null);
const Main = () => {

    const [ingredients, setIngredients] = useState<string[]>([]);
    
    const fei = { name: 'Liu',age: 40};
    const color = 'Yellow';

    const addIngredient = (formData:FormData) => {
        const ingredient = formData.get('email') as string;
        setIngredients(pre=>[...pre,ingredient]);
        const data = Object.fromEntries(formData);
        const colors = formData.getAll('color');
        const new_data = {...data,color:colors};
        console.log(new_data);
    }
    const ingredientList = ingredients.map((ingredient,index) => <li key={index}>{ingredient}</li>) 

  return (
        <GlobalContext.Provider value={{fei,color}}>
        <main>
            <form action={addIngredient}>
                <input 
                    type="text" 
                    name="email"
                    placeholder='e.g. Pizza' 
                /><br />
            
                <button>
                    Add Ingredient
                </button>
            </form>
            { ingredients.length > 0 && <p>Ingredients on hand:</p> }
            <ol>
                { ingredientList }
            </ol>
            {
                ingredients.length >= 3 &&
                <>
                <section>
                    <div className="box_container">
                        <div>
                            <h3>Ready for recipe?</h3>
                            <p>Generate a recipe from your list of ingredients.</p>
                        </div>
                        <button>Get a recipe</button>
                    </div>
                    
                </section>
                </>
            }
            <Drinks />
        </main>
    </GlobalContext.Provider>
  )
}



export default Main 
