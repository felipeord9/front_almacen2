import { useState, createContext} from 'react'

const Context = createContext({})

export function CellarContextProvider({ children }) {
    const [ cellar, setCellar ] = useState(null)

    return (
        <Context.Provider value={{ cellar, setCellar }}>{children}</Context.Provider>
    )
}

export default Context