import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const CityContext = createContext(null)

const SUPPORTED_CITIES = ['Mumbai', 'Nanded']

export const CityProvider = ({ children }) => {
  const { user } = useAuth()

  const [city, setCity] = useState(() => {
    return localStorage.getItem('nearserve_city') || ''
  })

  // Auto-set city from user's registered address if not already set
  useEffect(() => {
    if (user?.address && !localStorage.getItem('nearserve_city')) {
      const matched = SUPPORTED_CITIES.find(c =>
        user.address.toLowerCase().includes(c.toLowerCase())
      )
      if (matched) {
        setCity(matched)
        localStorage.setItem('nearserve_city', matched)
      }
    }
  }, [user])

  const changeCity = (newCity) => {
    setCity(newCity)
    localStorage.setItem('nearserve_city', newCity)
  }

  const clearCity = () => {
    setCity('')
    localStorage.removeItem('nearserve_city')
  }

  return (
    <CityContext.Provider value={{ city, changeCity, clearCity, SUPPORTED_CITIES }}>
      {children}
    </CityContext.Provider>
  )
}

export const useCity = () => {
  const ctx = useContext(CityContext)
  if (!ctx) throw new Error('useCity must be used inside CityProvider')
  return ctx
}