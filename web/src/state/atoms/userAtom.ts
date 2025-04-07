import {atom} from 'recoil'

interface userAtomState {
    isLoggedIn: boolean
    id: string
}

export const userAtom = atom<userAtomState>({
    key: 'userAtom',
    default: {
        isLoggedIn:false,
        id: ""
    },
})