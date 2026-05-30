export type Role = {
    roleid: number
    rolename: string
}

export type Profile = {
    profileid: number
    userid: string
    fullname: string | null
    address: string | null
    createdat: string
    roles: Role
}