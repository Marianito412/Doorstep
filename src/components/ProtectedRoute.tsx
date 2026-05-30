import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { type ReactNode } from 'react'

type Props = {
    children: ReactNode
    requiredRole?: string
}

export function ProtectedRoute({ children, requiredRole }: Props) {
    const { user, profile, loading } = useAuthContext()

    if (loading) return <div>Loading...</div>
    if (!user)   return <Navigate to="/login" />
    if (requiredRole && profile?.roles?.rolename !== requiredRole)
        return <Navigate to="/dashboard" />

    return <>{children}</>
}