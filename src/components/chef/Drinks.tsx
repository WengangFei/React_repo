import React,{ useState,useEffect, useRef, useLayoutEffect } from 'react'
import ChildDrinks from './ChildDrinks';
import { InputComponent } from './ChildDrinks';



interface Drink {
    strDrinkThumb: string;
    strDrink: string;
    strInstructions: string;
    strIngredient1: string;
    strIngredient2: string;
    strIngredient3: string;
    strIngredient4: string;
}



const Drinks = () => {
    const imgRef = useRef(null);
    // const [width, setWidth] = useState(0);
     const [food, setFood] = useState<string>('apple');
     const [drinks,setDrinks] = useState([]);

    //  useLayoutEffect(() => {
    //     // This will run synchronously after the DOM is updated
    //     const divWidth = imgRef.current.offsetWidth;
    //     setWidth(divWidth);
    //   }, []); // E


        useEffect(()=>{
            (
                async ()=>{
                    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${food}`);
                    const data = await response.json();
                 
                    setDrinks(data.drinks.slice(0,5));
                }
            )() 
            // inputRef.current.focus();
            // return ()=>{
            //     console.log('effect')
            // }
        },[food])

    const searchDrinks = (formData:FormData)=>{
        const drink = formData.get('drink') as string;
        setFood(drink);
    }

  return (

    <div>
        {/* <InputComponent ref={inputRef} placeholder="Type something..." />
        <button onClick={focusInput}>Focus Input</button> */}
        <form action={searchDrinks} ref={imgRef}>
            <input type="text" name="drink" placeholder='Search for a drink' />
            <button className="drink_button">Search Drinks</button>
        </form>
        <ChildDrinks />
        { drinks.map((drink:Drink,index)=>{
            return (
                <div className="drinks_container" key={index}>
                    <div className="container_image" >
                        <img src={drink.strDrinkThumb} alt={drink.strDrink} />
                        
                    </div>
                    
                    <div className="container_body">
                        <h4>Name: {drink.strDrink}</h4>
                        <p>Instruction:</p>
                        <p>
                            {
                                drink.strInstructions.length > 200 ? 
                                <>
                                    {drink.strInstructions.slice(0, 200)} 
                                    <span className="read_more"> ...Read More</span>
                                </> 
                                : drink.strInstructions
                            }
                        </p>
                        <p>Ingredients:</p>
                        <ul>
                            <li>{drink.strIngredient1}</li>
                            <li>{drink.strIngredient2}</li> 
                            { drink.strIngredient3 && <li>{ drink.strIngredient3} </li>}
                            { drink.strIngredient4 && <li>{ drink.strIngredient4} </li>}
                        </ul>   
                    </div>
                    
                </div>
            )
        })}
    </div>
  )
}

export default Drinks