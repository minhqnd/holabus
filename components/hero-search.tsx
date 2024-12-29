'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AutocompleteInput } from '@/components/autocomplete-input'

export function HeroSearch() {
  return (
    <div className="relative w-full">
      <div className="container relative flex-col items-center justify-center text-center mx-auto px-4 hidden md:flex">
        <div className="absolute sm:w-full max-w-4xl rounded-3xl bg-white p-10 shadow-2xl -translate-y-40 md:-translate-y-0">
          <h1 className="mb-6 text-xl font-bold text-black md:text-5xl lg:text-4xl">
            Về nhà ăn tết thôi! Quê bạn ở đâu vậy nhỉ?
          </h1>
          <p className="mb-8 text-lg text-gray-600">
            Hơn 20 tuyến xe giá tốt đang chờ đợi chở bạn về nhà
          </p>
          <div className="flex flex-row gap-4">
            <AutocompleteInput />
            {/* <Button className="bg-red-600 hover:bg-red-700 w-[30%] rounded-full h-12">Tìm kiếm</Button> */}
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/25 md:hidden h-lvh" />
      <div className="container relative flex min-h-[600px] flex-col items-center justify-center text-center mx-auto px-4 md:hidden">
        <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
          Về nhà ăn tết thôi!
          <br />
          Quê bạn ở đâu vậy nhỉ?
        </h1>
        <p className="mb-8 text-lg text-white/90">
          Hơn 20 tuyến xe giá tốt đang chờ đợi chở bạn về nhà
        </p>
        <div className="w-full max-w-4xl rounded-3xl bg-white p-6 shadow-lg">
          <div className="grid gap-4">
            {/* <Input
              type="text"
              placeholder="Nhập tỉnh thành"
              className="rounded-full border-gray-300 focus:border-red-500 focus:ring-red-500 focus-visible:ring-red-500 focus-visible:ring-2 text-base px-4 w-full"
              height="3rem"
              borderRadius="9999px"
            />
            <Button className="bg-red-600 hover:bg-red-700 rounded-full h-12">Tìm kiếm</Button> */}
            <AutocompleteInput />
          </div>
        </div>
      </div>
    </div>
  )
}

