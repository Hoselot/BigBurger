import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { InputOtp } from "@heroui/input-otp";
import { PiPlus, PiMinus } from "react-icons/pi";

// ✅ Tipo con onChange agregado
interface CounterProps {
  basePrice: number;
  onChange: (cantidad: number) => void;
}

export default function Counter({ basePrice, onChange }: CounterProps) {
  const [count, setCount] = useState<number>(1);

  const handleChange = (delta: number) => {
    setCount((prev) => Math.max(1, Math.min(5, prev + delta)));
  };

  // ✅ Este useEffect se asegura de comunicar cada cambio de `count`
  useEffect(() => {
    onChange(count);
  }, [count]);

  return (
    <div className="flex justify-between items-center ">
      <div className="flex items-center gap-3">
        <Button radius="lg" size="sm" isIconOnly onPress={() => handleChange(-1)}>
          <PiMinus className="size-4" />
        </Button>

        <InputOtp
          variant="bordered"
          radius="lg"
          length={1}
          value={count.toString()}
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            const value = Math.min(5, Math.max(1, parseInt(target.value) || 1));
            setCount(value);
          }}
        />

        <Button radius="lg" size="sm" isIconOnly onPress={() => handleChange(1)}>
          <PiPlus className="size-4" />
        </Button>
      </div>
      <div>
        <p className="text-xl text-gray-900">${(basePrice * count).toFixed(2)}</p>
      </div>
    </div>
  );
}
