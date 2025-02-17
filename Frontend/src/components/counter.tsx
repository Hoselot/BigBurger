import { useState } from "react";
import { Button } from "@heroui/button";
import {InputOtp} from "@heroui/input-otp";
import { PiPlus, PiMinus } from "react-icons/pi";
// Definir el tipo de las props
interface CounterProps {
    basePrice: number;
  }
export default function Counter({ basePrice }: CounterProps) {
    const [count, setCount] = useState<number>(1);

    const handleChange = (delta: number) => {
        setCount((prev) => Math.max(1, Math.min(5, prev + delta))); // Evita valores menores a 1
      };
     
  return (
    <div className="flex justify-between items-center ">
        <div className="flex items-center gap-3">
            <Button radius="lg" size="sm" isIconOnly onPress={() => handleChange(-1)}>
                <PiMinus className="size-4"/>
            </Button>
            
            <InputOtp 
                
                variant="bordered"
                radius="lg"
                length={1} // Permitir hasta 2 dígitos
                value={count.toString()} 
                onChange={(e) => {
                    const target = e.target as HTMLInputElement; // Asegurar que es un input
                    const value = Math.min(5, Math.max(1, parseInt(target.value) || 1)); // Límite entre 1 y 9
                    setCount(value);
                }}
            />
            <Button radius="lg" size="sm" isIconOnly onPress={() => handleChange(1)}>
                <PiPlus className="size-4"/>
            </Button>
        </div>
        <div>
            <p className="text-xl text-gray-900">${(basePrice * count).toFixed(2)}</p>
        </div>
    </div>
  );
}