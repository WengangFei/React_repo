import React,{ useEffect, useState } from 'react';
import { FaLocationDot } from "react-icons/fa6";
import { FaEarthAfrica } from "react-icons/fa6";

type DataForm = {
    body: string,
    id: number,
    title: string,
    userId: number,
    country?: string,
}

const FetchData = ({ countries,name }:{countries:string[],name:string}) => {

  useEffect(() => { 
    const fetchData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        let data = await response.json();
        data = data.slice(0,5).map((obj:DataForm,index:number)=>{
            return {...obj,country:countries[index]}
        },countries)
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData(); // Calling the async function inside useEffect

    return ()=>{
        console.log('clean function')
    }
  },[countries]);


  const [data,setData] = useState<DataForm[]>([]);
  console.log(data);
  const time = new Date().getHours();
  let greet = null;
  if(time > 18 && time < 21){
    greet = 'Evening'
  }
  else if (time >= 21 && time <= 24){
    greet = 'Night'
  }
  else {
    greet = 'Morning'
  }

  return (
    <div>
        <header><FaEarthAfrica />  <span>National Images</span></header>
        <main>
            <p>Good { greet } { name }</p>
            <ul>
                { 
                    data && data.map((item:DataForm) => 
                        <div key={item.id} className='item'>
                            <img className="image" src={`https://picsum.photos/200/300?random=${item.id}`}/>
                            <div>
                                <p className="title">
                                <FaLocationDot style={{color:'red'}}/> { item.country }  <a>View in Google</a>
                                </p>
                                <p className="sub_title">{item.title.slice(0,10)}</p>
                                <p className="title_body">{item.body}</p>
                            </div>
                        
                        </div>
                    )
                }
            </ul>
        </main>
        
    </div>
  );
};

export default FetchData;
