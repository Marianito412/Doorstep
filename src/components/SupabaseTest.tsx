import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
console.log(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)

type ServiceCategory = {
    categoryname: string
}

function SupabaseTest() {
    const [instruments, setInstruments] = useState<ServiceCategory[]>([]);
    useEffect(() => {
        getInstruments();
    }, []);
    
    async function getInstruments() {
        const { data, error } = await supabase.from("servicecategories").select();
        if (error) {
            console.error(error);
            return;
        }
        setInstruments(data);
    }
    
    return(
        <>
            <ul>
                {instruments.map((instrument) => (
                    <li key={instrument.categoryname}>{instrument.categoryname}</li>
                ))}
            </ul>
        </>
    )
}

export default SupabaseTest;