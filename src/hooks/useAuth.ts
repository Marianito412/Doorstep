import {useEffect, useState} from 'react'
import { type User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import {type Profile} from '../types/database'

type SignInParams = {
    email: string
    password: string
}

type SignUpParams = SignInParams & {
    fullName: string
}

type AuthState = {
    user: User | null
    profile: Profile | null
    loading: boolean
    signIn: (params: SignInParams) => Promise<void>
    signUp: (params: SignUpParams) => Promise<void>
    signOut: () => Promise<void>
}

export function useAuth(): AuthState {
    const [user, setUser]       = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        /*
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            if (session?.user) fetchProfile(session.user.id)
            else setLoading(false)
        })
        */
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null)
                if (session?.user) fetchProfile(session.user.id)
                else { setProfile(null); setLoading(false) }
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    async function fetchProfile(userId: string): Promise<void> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*, roles(*)')
            .eq('userid', userId)
            .single<Profile>()
        
        if (!error){
            setProfile(data)
        } 
        setLoading(false)
    }

    async function signUp({ email, password, fullName }: SignUpParams): Promise<void> {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName }
            }
        })
        if (error) throw error
    }

    async function signIn({ email, password }: SignInParams): Promise<void> {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
    }

    async function signOut(): Promise<void> {
        await supabase.auth.signOut()
    }
    
    

    return { user, profile, loading, signIn, signUp, signOut }
}