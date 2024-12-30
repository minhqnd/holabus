'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AutocompleteInput } from '@/components/autocomplete-input'

interface SearchHeaderProps {
  provinceName: string;
}

export function SearchHeader({ provinceName }: SearchHeaderProps) {
  return (
    <div className="mb-8 rounded-3xl bg-white p-6 shadow-lg">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="font-bold text-lg">Điểm đi</Label>
          <Input
            type="text"
            value="Trường Đại học FPT"
            className="rounded-full border-gray-300 focus:border-transparent focus:ring-transparent focus-visible:ring-transparent focus-visible:ring-2 text-base px-4 cursor-not-allowed w-full"
            height="3rem"
            borderRadius="9999px"
            readOnly
          />
        </div>
        <div className="space-y-2">
          <Label className="font-bold text-lg">Điểm đến</Label>
          <AutocompleteInput initialValue={provinceName} />
        </div>
      </div>
    </div>
  )
}

