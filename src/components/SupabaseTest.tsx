import { useEffect, useState } from "react";
import {ProtectedRoute} from "./ProtectedRoute.tsx";
import {supabase} from "../lib/supabase.ts";
import {useAuthContext} from "../context/AuthContext.tsx";
import {Button, Text} from "@mantine/core";
import MainAppShell from "./MainAppShell.tsx";


type ServiceCategory = {
    categoryname: string
}

function SupabaseTest() {
    const [instruments, setInstruments] = useState<ServiceCategory[]>([]);
    const user = useAuthContext().user
    const profile = useAuthContext().profile
    const signOut = useAuthContext().signOut
    
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
    
    async function handleSignOut(){
        await signOut();
    }
    
    return(
        <>
            <ProtectedRoute>
                <MainAppShell>
                    <Text>{profile ? profile.roles.rolename : ""}</Text>

                    <Button onClick={() => {handleSignOut()}}>
                        Test
                    </Button>
                    <ul>
                        {instruments.map((instrument) => (
                            <li key={instrument.categoryname}>{instrument.categoryname}</li>
                        ))}
                    </ul>
                </MainAppShell>
            </ProtectedRoute>

        </>
    )
}

export default SupabaseTest;