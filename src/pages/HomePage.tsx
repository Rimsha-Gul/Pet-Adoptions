import { useContext, useEffect, useState } from 'react'
import api from '../api'
import { AppContext } from '../context/AppContext'
import loadingIcon from '../assets/loading.gif'
import Select from 'react-select'
import { FaSearch } from 'react-icons/fa'
import PetCard from '../components/PetComponents/PetCard'
import InfiniteScroll from 'react-infinite-scroll-component'
import socket from '../socket/socket'

export interface Pet {
  shelterID: string
  shelterName: string
  shelterRating: number
  microchipID: string
  name: string
  birthDate: string
  color: string
  bio: string
  images: string[]
  applicationID?: string
  gender: string
  breed: string
  activityNeeds: string
  levelOfGrooming: string
  isHouseTrained: string
  healthInfo: {
    healthCheck: boolean
    allergiesTreated: boolean
    wormed: boolean
    heartwormTreated: boolean
    vaccinated: boolean
    deSexed: boolean
  }
  traits: string[]
  adoptionFee: string
  hasAdoptionRequest: boolean
  isAdopted: boolean
  category: string
}

const ageRange = (ages: number[]): string[] => {
  const minAge = Math.min(...ages)
  const maxAge = Math.max(...ages)
  const rangeSize = Math.ceil((maxAge - minAge) / 5) // define the increment for age ranges

  const ageRanges = []
  for (let i = minAge; i < maxAge; i += rangeSize) {
    const next = i + rangeSize
    ageRanges.push(
      next < maxAge ? `${i}-${next} years` : `${i} years and above`
    )
  }

  return ageRanges
}

const HomePage = () => {
  const options = [
    { value: '', label: 'All' },
    { value: 'Cat', label: 'Cat' },
    { value: 'Dog', label: 'Dog' },
    { value: 'Horse', label: 'Horse' },
    { value: 'Rabbit', label: 'Rabbit' },
    { value: 'Bird', label: 'Bird' },
    { value: 'Small and Furry', label: 'Small & Furry' },
    { value: 'Scales, Fins and Others', label: 'Scales, fins & others' },
    { value: 'Barnyard', label: 'Barnyard' }
  ]
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      border: state.isFocused ? '1px solid #ff5363' : '1px solid #9ca3af',
      borderRadius: '0.375rem',
      backgroundColor: '#fff',
      padding: '0.5rem',
      cursor: 'pointer',
      '&:hover': {
        border: '1px solid #ff5363'
      }
    }),
    option: (provided: any, state: { isSelected: any; isFocused: any }) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#ff5363' : '#fff',
      color: state.isSelected ? '#fff' : '#000',
      padding: '0.5rem',
      '&:hover': {
        backgroundColor: '#fb7a75',
        color: '#fff',
        cursor: 'pointer'
      }
    })
  }
  const appContext = useContext(AppContext)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isMoreLoading, setIsMoreLoading] = useState<boolean>(false)
  const [pets, setPets] = useState<Pet[]>([])
  const [petsLoadingError, setPetsLoadingError] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [timeoutId, setTimeoutId] = useState<number | undefined>(undefined)
  const [filterOption, setFilterOption] = useState<string>('')
  const [prevFilterOption, setPrevFilterOption] = useState<string>('')
  const [prevSearchQuery, setPrevSearchQuery] = useState<string>('')
  const [showExtraFilters, setShowExtraFilters] = useState<boolean>(false)
  const [colors, setColors] = useState<string[]>([])
  const [colorFilter, setColorFilter] = useState<string>('')
  const [ages, setAges] = useState<string[]>([])
  const [breeds, setBreeds] = useState<string[]>([])
  const [genders, setGenders] = useState<string[]>([])
  const [ageFilter, setAgeFilter] = useState<string>('')
  const [breedFilter, setBreedFilter] = useState<string>('')
  const [genderFilter, setGenderFilter] = useState<string>('')
  const [noPetsFound, setNoPetsFound] = useState<boolean>(false)
  const userEmail = localStorage.getItem('userEmail')

  const accessToken = localStorage.getItem('accessToken')
  api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

  useEffect(() => {
    socket.emit('join_room', userEmail)
  })

  useEffect(() => {
    // When category changes, reset all the filters
    if (prevFilterOption !== filterOption) {
      setColorFilter('')
      setAgeFilter('')
      setBreedFilter('')
      setGenderFilter('')
    }
  }, [filterOption])

  /// This effect is responsible for managing the debounce
  useEffect(() => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId)
    }

    const id = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500)

    setTimeoutId(id)

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [searchQuery])

  useEffect(() => {
    fetchPets(currentPage)
  }, [
    filterOption,
    debouncedSearchQuery,
    colorFilter,
    ageFilter,
    breedFilter,
    genderFilter
  ])

  const fetchPets = async (apiPage: number) => {
    try {
      let page = apiPage
      setPetsLoadingError('')
      setIsLoading(true)
      if (
        prevFilterOption !== filterOption ||
        prevSearchQuery !== searchQuery
      ) {
        page = 1
        setCurrentPage(1)
        setPrevFilterOption(filterOption)
        setPrevSearchQuery(searchQuery)
      }
      const response = await api.get('/pets', {
        params: {
          page,
          limit: 6,
          searchQuery,
          filterOption,
          colorFilter,
          ageFilter,
          breedFilter,
          genderFilter
        }
      })
      const { pets, totalPages, colors, ages, breeds, genders } = response.data
      appContext.setLoggedIn?.(true)
      const ageRanges = ageRange(ages)
      setNoPetsFound(false)
      if (totalPages === 0) setNoPetsFound(true)
      setPets(pets)
      setTotalPages(totalPages)
      setColors(colors)
      setAges(ageRanges)
      setBreeds(breeds)
      setGenders(genders)
    } catch (error: any) {
      if (error.response.status === 500) {
        setPetsLoadingError('Failed to fetch pets')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleOptionChange = (selectedOption: any) => {
    if (selectedOption) {
      setFilterOption(selectedOption.value)
      setShowExtraFilters(selectedOption.value !== '')
    } else {
      setFilterOption('')
      setShowExtraFilters(false)
    }
  }

  const loadMoreData = async () => {
    if (currentPage < totalPages) {
      try {
        setIsMoreLoading(true)
        setPetsLoadingError('')
        const nextPage = currentPage + 1

        // Fetch the next page of data
        const response = await api.get('/pets', {
          params: {
            page: nextPage,
            limit: 6,
            searchQuery,
            filterOption,
            colorFilter,
            ageFilter,
            breedFilter,
            genderFilter
          }
        })

        const {
          pets: newPets,
          totalPages,
          colors,
          ages,
          breeds,
          genders
        } = response.data

        // Append the new pets to the existing pets
        setPets((prevPets) => [...prevPets, ...newPets])
        setCurrentPage(nextPage)
        setTotalPages(totalPages)
        setColors(colors)
        setAges(ages)
        setBreeds(breeds)
        setGenders(genders)
      } catch (error: any) {
        if (error.response.status === 500) {
          setPetsLoadingError('Failed to fetch pets')
        }
      } finally {
        setIsMoreLoading(false)
      }
    }
  }

  // Convert colors array to Select options
  const colorOptions = colors.map((color) => ({ value: color, label: color }))
  const ageOptions = ages.map((age) => ({ value: age, label: age }))
  const breedOptions = breeds.map((breed) => ({ value: breed, label: breed }))
  const genderOptions = genders.map((gender) => ({
    value: gender,
    label: gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase()
  }))

  // Add 'All' option
  colorOptions.unshift({ value: '', label: 'All' })
  ageOptions.unshift({ value: '', label: 'All' })
  breedOptions.unshift({ value: '', label: 'All' })
  genderOptions.unshift({ value: '', label: 'All' })

  return (
    <>
      <div className="flex flex-col justify-center p-8 mt-14">
        <div className="flex flex-col sm:flex-row gap-6 justify-end me-0 md:me-24 items-end pt-8">
          <div className="flex items-center justify-between w-64 sm:w-72 h-[3.3rem] pr-4 border border-gray-400 rounded-md focus-within:outline-none focus-within:ring-primary focus-within:border-primary hover:border-primary">
            <input
              type="text"
              placeholder="Search pets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 w-full focus:outline-none rounded-md"
            />
            <FaSearch className="text-gray-500 hover:cursor-pointer" />
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-primary">Filter by category</p>
            <Select
              className="w-64"
              options={options}
              styles={customStyles}
              onChange={handleOptionChange}
              value={options.find((option) => option.value === filterOption)}
            />
          </div>
        </div>

        {showExtraFilters && (
          <div className="flex flex-wrap md:flex-row gap-6 mt-6 me-0 md:me-24 justify-end ">
            <div className="flex flex-col gap-1">
              <p className="text-primary ps-1">Color</p>
              <Select
                className="w-64"
                options={colorOptions}
                styles={customStyles}
                onChange={(selectedOption) =>
                  setColorFilter(selectedOption?.value || '')
                }
                value={colorOptions.find(
                  (option) => option.value === colorFilter
                )}
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-primary ps-1">Age</p>
              <Select
                className="w-64"
                options={ageOptions}
                styles={customStyles}
                onChange={(selectedOption) =>
                  setAgeFilter(selectedOption?.value || '')
                }
                value={ageOptions.find((option) => option.value === ageFilter)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-primary ps-1">Breed</p>
              <Select
                className="w-64"
                options={breedOptions}
                styles={customStyles}
                onChange={(selectedOption) =>
                  setBreedFilter(selectedOption?.value || '')
                }
                value={breedOptions.find(
                  (option) => option.value === breedFilter
                )}
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-primary ps-1">Gender</p>
              <Select
                className="w-64"
                options={genderOptions}
                styles={customStyles}
                onChange={(selectedOption) =>
                  setGenderFilter(selectedOption?.value || '')
                }
                value={genderOptions.find(
                  (option) => option.value === genderFilter
                )}
              />
            </div>
          </div>
        )}
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <img src={loadingIcon} alt="Loading" className="h-10 w-10" />
          </div>
        )}
        {petsLoadingError && <p>{petsLoadingError}</p>}
        {!isLoading && !petsLoadingError && (
          <>
            {noPetsFound ? (
              <div className="flex items-center justify-center h-full mt-6">
                <p>No pets found with the selected criteria.</p>
              </div>
            ) : (
              <InfiniteScroll
                dataLength={pets.length}
                next={loadMoreData}
                hasMore={currentPage < totalPages}
                loader={
                  isMoreLoading && (
                    <div className="flex items-center justify-center" key={0}>
                      <img
                        src={loadingIcon}
                        alt="Loading"
                        className="h-10 w-10"
                      />
                    </div>
                  )
                }
              >
                <div
                  data-cy="pet-grid"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-0.5 sm:p-10 gap-16 mt-6 sm:m-0 md:m-12"
                >
                  {pets.map((pet) => (
                    <PetCard key={pet.microchipID} pet={pet} />
                  ))}
                </div>
              </InfiniteScroll>
            )}
          </>
        )}
      </div>
    </>
  )
}
export default HomePage
