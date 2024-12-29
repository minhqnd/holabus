"use client"

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { PROVINCES, Province } from '@/lib/constants/provinces'
import { Search } from 'lucide-react'

        export function AutocompleteInput() {
            const router = useRouter()
            const [inputValue, setInputValue] = useState('')
            const [selectedId, setSelectedId] = useState<string>('')
            const [suggestions, setSuggestions] = useState<Province[]>([])
            const [isOpen, setIsOpen] = useState(false)
            const [selectedIndex, setSelectedIndex] = useState(-1)
            const wrapperRef = useRef<HTMLDivElement>(null)
            const [shake, setShake] = useState(false)

            const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                setInputValue(value)
                setSelectedId('')

                if (value.length > 0) {
                    const filtered = PROVINCES.filter(province =>
                        province.name.toLowerCase().includes(value.toLowerCase())
                    )
                    setSuggestions(filtered)
                    setIsOpen(true)
                } else {
                    setSuggestions([])
                    setIsOpen(false)
                }
                setSelectedIndex(-1)
            }

            const handleSelectSuggestion = (province: Province) => {
                setInputValue(province.name)
                setSelectedId(province.id)
                setIsOpen(false)
                setSuggestions([])
            }

            const handleSearch = () => {
                if (selectedId) {
                    router.push(`/search?tinh=${selectedId}`)
                }
            }

            const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setSelectedIndex(prev =>
                        prev < suggestions.length - 1 ? prev + 1 : prev
                    )
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    setSelectedIndex(prev => prev > 0 ? prev - 1 : prev)
                } else if (e.key === 'Enter' && selectedIndex >= 0) {
                    handleSelectSuggestion(suggestions[selectedIndex])
                }
            }

            const handleInvalidClick = () => {
                if (!selectedId) {
                    setShake(true)
                    setTimeout(() => setShake(false), 500)
                }
            }

            // Click outside to close
            useEffect(() => {
                const handleClickOutside = (event: MouseEvent) => {
                    if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                        setIsOpen(false)
                    }
                }
                document.addEventListener('mousedown', handleClickOutside)
                return () => document.removeEventListener('mousedown', handleClickOutside)
            }, [])

            return (
                <div className="flex gap-4 w-full" ref={wrapperRef}>
                    <div className="relative flex-1">
                        <Input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Nhập tỉnh thành"
                            className="rounded-full border-gray-300 focus:border-red-500 focus:ring-red-500 focus-visible:ring-red-500 focus-visible:ring-2 text-base px-4 w-full"
                            height="3rem"
                            borderRadius="9999px"
                        />
                        {isOpen && suggestions.length > 0 && (
                            <div className="absolute z-[9999] w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
                                {suggestions.map((province, index) => (
                                    <div
                                        key={province.id}
                                        className={`px-4 py-3 cursor-pointer text-base hover:bg-gray-100 text-left ${
                                            index === selectedIndex ? 'bg-gray-100' : ''
                                        }`}
                                        onClick={() => handleSelectSuggestion(province)}
                                    >
                                        {province.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={selectedId ? handleSearch : handleInvalidClick}
                        className={`rounded-full px-8 h-12 md:flex items-center justify-center hidden
                            bg-red-600 hover:bg-red-700 text-white 
                            transition-all duration-200 ease-in-out
                            ${!selectedId && 'opacity-80'}
                            ${shake ? 'animate-shake' : ''}`}
                    >
                        Tìm kiếm
                    </button>
                    <button 
                        onClick={selectedId ? handleSearch : handleInvalidClick}
                        className={`rounded-full w-12 h-12 flex md:hidden items-center justify-center
                            bg-red-600 hover:bg-red-700 text-white 
                            transition-all duration-200 ease-in-out
                            ${!selectedId && 'opacity-80'}
                            ${shake ? 'animate-shake' : ''}`}
                    >
                        <Search className="w-5 h-5" />
                    </button>
                </div>
            )
        }