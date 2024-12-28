interface ProgressStepsProps {
  currentStep: number
}

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  const steps = [
    { number: 1, title: 'Chọn chuyến', subtitle: 'Vui lòng chọn chuyến xe' },
    { number: 2, title: 'Đặt chỗ', subtitle: 'Điền thông tin để đặt chỗ' },
    { number: 3, title: 'Thanh toán', subtitle: 'Thanh toán để nhận vé xe' },
  ]

  return (
    <div className="flex justify-between w-full">
      {steps.map((step) => (
        <div key={step.number} className="relative flex flex-1 items-center">
          <div
              className={`h-0.5 flex-1 hidden md:block ${
                currentStep + 1 > step.number ? 'bg-[#86efac]' : 'bg-gray-200'
              }`}
            />
          <div className="flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${currentStep >= step.number
                ? 'bg-[#86efac] text-black'
                : 'bg-gray-200 text-gray-500'
                }`}
            >
              {step.number}
            </div>
            <div className="mt-2 text-center">
              <div className="font-medium">{step.title}</div>
              <div className="text-sm text-gray-500">{step.subtitle}</div>
            </div>
          </div>
          {/* {index < steps.length - 1 && ( */}
            <div
              className={`h-0.5 flex-1 hidden md:block ${
                currentStep > step.number ? 'bg-[#86efac]' : 'bg-gray-200'
              }`}
            />
          {/* )} */}
        </div>
      ))}
    </div>
  )
}

