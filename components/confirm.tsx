'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface ConfirmProps {
    tripData: {
        name: string;
        time: string;
        date: string;
        price: string;
        location: string[];
    };
    userData: {
        sex: string;
        name: string;
        mail: string;
        phone: string;
    };
    onBack: () => void;
    onConfirm: () => void;
}

export function Confirm({ tripData, userData, onBack, onConfirm }: ConfirmProps) {
    return (
        <div className="rounded-3xl bg-white p-6 mb-16">
            <h2 className="mb-6 text-2xl font-bold">Xác nhận thông tin</h2>
            
            <div className="space-y-6">
                {/* Thông tin chuyến đi */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Thông tin chuyến đi</h3>
                    <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tên chuyến:</span>
                            <span className="font-medium">{tripData.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Thời gian:</span>
                            <span className="font-medium">{tripData.time} · {tripData.date}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Giá vé:</span>
                            <span className="font-medium text-red-600">{tripData.price} VND</span>
                        </div>
                    </div>
                    
                    {/* Hiển thị lộ trình */}
                    <div className="mt-4">
                        <div className="text-gray-600 mb-2">Lộ trình:</div>
                        <div className="space-y-0">
                            {tripData.location.map((place, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="flex h-full flex-col items-center">
                                        {index !== 0 && <div className="relative z-0 h-3 w-0.5 border-l border-dashed border-gray-300"></div>}
                                        <div className={`h-2 w-2 rounded-full ${index === 0 ? 'bg-green-500' : index === tripData.location.length - 1 ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                                        {index !== tripData.location.length - 1 && <div className="relative z-0 h-3 w-0.5 border-l border-dashed border-gray-300"></div>}
                                    </div>
                                    <span className="text-gray-600">{place}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Thông tin hành khách */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Thông tin hành khách</h3>
                    <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Danh xưng:</span>
                            <span className="font-medium">{userData.sex === '1' ? 'Anh' : 'Chị'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Họ và tên:</span>
                            <span className="font-medium">{userData.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Số điện thoại:</span>
                            <span className="font-medium">{userData.phone}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-medium">{userData.mail}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between pt-6">
                    <Button
                        type="button"
                        variant="ghost"
                        className="rounded-full"
                        onClick={onBack}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại
                    </Button>
                    <Button
                        type="button"
                        className="rounded-full bg-red-600 text-white hover:bg-red-700"
                        onClick={onConfirm}
                    >
                        Xác nhận đặt vé
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}