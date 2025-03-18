import React,{ useContext, useReducer,useRef, useEffect, forwardRef } from 'react';
import { GlobalContext } from './Main'


// type Person = {
//     name:string,
//     age:number
// }
export const InputComponent  = forwardRef((props,ref)=>{
    return (
        <div ref={ref}>
            <input  {...props} />
            <button>Addddd</button>
        </div>
       
    )
})
const ChildDrinks = () => {

    const reducer = (state,action)=>{

        switch(action.type){
            case 'Add':
                return state + 1
            case 'Sub':
                return state - 1;
            case 'Mul':
                return state * 2;
            case 'Ret':
                return 0;
            default:
                console.log('Fucked!');
        }
    }
    const[state,dispatch] = useReducer(reducer,0);
    const ref = useRef(0);
    const h2Ref = useRef(null);
    // const p = useContext<{fei:Person,color:string}|null>(GlobalContext);
    useEffect(()=>{
        ref.current = state;
    },[state]);
    return (
        <>
            <h2>Child Drinks component:</h2>
            <h2 ref={h2Ref}>Current:{ state }</h2>
            <h3>Previous: { ref.current } </h3>
            <button onClick={()=>dispatch({type:'Add'})}>Add</button>
            <button onClick={()=>dispatch({type:'Sub'})}>Sub</button>
            <button onClick={()=>dispatch({type:'Mul'})}>Sub</button>
            <button onClick={()=>dispatch({type:'Ret'})}>Reset</button>
           
            {/* <h4> { JSON.stringify(p) } </h4> */}
        </>
        
    )
}

export default ChildDrinks