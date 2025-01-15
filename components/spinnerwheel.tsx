import React, { useState, useEffect } from 'react';
import { Wheel } from 'react-custom-roulette';
import { Button } from "@/components/ui/button"
import Confetti from 'react-dom-confetti';
import Image from 'next/image';

const data = [
    { option: 'Giảm 50%', style: { backgroundColor: '#2ab2d1', textColor: 'white' }, percentage: 1 },
    { option: 'Giảm 5%', style: { backgroundColor: '#ff4f4f', textColor: 'white' }, percentage: 90 },
    { option: 'Giảm 5%', style: { backgroundColor: '#ff4f4f', textColor: 'white' }, percentage: 90 },
    { option: 'Giảm 10%', style: { backgroundColor: '#2bd6ca', textColor: 'white' }, percentage: 5 },
    { option: 'Giảm 5%', style: { backgroundColor: '#ff4f4f', textColor: 'white' }, percentage: 90},
    { option: 'Giảm 5%', style: { backgroundColor: '#ff4f4f', textColor: 'white' }, percentage: 90 },
    { option: 'Giảm 10%', style: { backgroundColor: '#2bd6ca', textColor: 'white' }, percentage: 5 },
    { option: 'Giảm 5%', style: { backgroundColor: '#ff4f4f', textColor: 'white' }, percentage: 90 },
    { option: 'Giảm 100%', style: { backgroundColor: '#F7B801', textColor: 'white' }, percentage: 0 },
    { option: 'Giảm 5%', style: { backgroundColor: '#ff4f4f', textColor: 'white' }, percentage: 90 },
    { option: 'Giảm 10%', style: { backgroundColor: '#2bd6ca', textColor: 'white' }, percentage: 5 },
    { option: 'Giảm 5%', style: { backgroundColor: '#ff4f4f', textColor: 'white' }, percentage: 90 },
    { option: 'Giảm 5%', style: { backgroundColor: '#ff4f4f', textColor: 'white' }, percentage: 90 },
];

const confettiConfig = {
    angle: 90,
    spread: 360,
    startVelocity: 40,
    elementCount: 70,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
};

const defaultRemainingCounts = {
    'Giảm 5%': 40,
    'Giảm 10%': 30,
    'Giảm 50%': 20,
    'Giảm 100%': 15,
};

const LuckyWheel: React.FC = () => {
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [confetti, setConfetti] = useState(false);
    const [remainingCounts, setRemainingCounts] = useState<{ [key: string]: number }>(defaultRemainingCounts);

    useEffect(() => {
        const savedCounts = localStorage.getItem('remainingCounts');
        if (savedCounts) {
            setRemainingCounts(JSON.parse(savedCounts));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('remainingCounts', JSON.stringify(remainingCounts));
    }, [remainingCounts]);

    const handleSpinClick = () => {
        if (!mustSpin) {
            const weightedData = data.flatMap((item, index) => 
                remainingCounts[item.option] > 0 ? Array(item.percentage).fill(index) : []
            );
            const newPrizeNumber = weightedData[Math.floor(Math.random() * weightedData.length)];
            setPrizeNumber(newPrizeNumber);
            setMustSpin(true);
            setShowResult(false);
        }
    };

    const handleInputChange = (option: string, value: string) => {
        setRemainingCounts(prevCounts => ({
            ...prevCounts,
            [option]: parseInt(value) || 0
        }));
    };

    const handleStopSpinning = () => {
        setMustSpin(false);
        setShowResult(true);
        setConfetti(true);
        const prizeOption = data[prizeNumber].option;
        setRemainingCounts(prevCounts => ({
            ...prevCounts,
            [prizeOption]: prevCounts[prizeOption] - 1
        }));
    };

    return (
        <div className="container flex flex-col items-center justify-center my-auto">
            <Image src="/red-logo.png" alt="HOLA BUS Logo" width={100} height={100} className="rounded-full h-24 w-auto bg-white p-2" />
            <h1 className="mb-8 text-center text-4xl font-bold text-red-800">Vòng quay may mắn</h1>
            <div className="flex flex-row">
                <div className="relative mb-8">
                    <Wheel
                        mustStartSpinning={mustSpin}
                        prizeNumber={prizeNumber}
                        data={data}
                        onStopSpinning={handleStopSpinning}
                        outerBorderColor="black"
                        outerBorderWidth={3}
                        radiusLineColor="black"
                        radiusLineWidth={1}
                        fontSize={18}
                        spinDuration={2.0}
                    />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                        <Image src="/modal-icon.png" alt="HOLA BUS Logo" width={100} height={100} className="rounded-full bg-white p-2" />
                    </div>
                </div>
                <div className="ml-8 p-4 bg-white rounded-lg shadow-lg max-h-fit">
                    <h2 className="text-2xl font-bold mb-4">Số lượng còn lại</h2>
                    <table className="table-auto border-collapse w-full rounded-lg overflow-hidden">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 px-4 py-2 bg-gray-200">Giải</th>
                                <th className="border border-gray-300 px-4 py-2 bg-gray-200">Còn lại</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(remainingCounts).map(([option, count]) => (
                                <tr key={option}>
                                    <td className="border border-gray-300 px-4 py-2">{option}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <input
                                            type="number"
                                            value={count}
                                            onChange={(e) => handleInputChange(option, e.target.value)}
                                            className="w-full text-center"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Button
                onClick={handleSpinClick}
                disabled={mustSpin}
                className="px-6 py-3 text-lg bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
            >
                QUAY NGAY
            </Button>
            <Confetti active={confetti} config={confettiConfig} />
            {showResult && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg text-center">
                        <h2 className="text-xl font-bold mb-4">CHÚC MỪNG!</h2>
                        <p className="text-lg">Bạn đã được {data[prizeNumber].option} vào giá vé!</p>
                        <Button
                            onClick={() => setShowResult(false)}
                            className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
                        >
                            Đóng
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LuckyWheel;

