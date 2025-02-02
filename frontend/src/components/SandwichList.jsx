import { useState, useEffect } from "react";
import SandwichCard from "./SandwichCard"
import sandwichService from '../services/sandwich';

const SandwichList = () => {
  const [sandwiches, setSandwiches] = useState([]);
  
  useEffect(() => {
    const fetchAllSandwiches = async () => {
      const sandwiches = await sandwichService.getAllSandwiches();
      setSandwiches(sandwiches);
    };
    fetchAllSandwiches();
  }, [])

  return (
    <div className='sandwichlist'>
      {sandwiches.map(sandwich => (
        <SandwichCard key={sandwich.id} sandwich={sandwich} />
      ))}
    </div>
  )
}

export default SandwichList