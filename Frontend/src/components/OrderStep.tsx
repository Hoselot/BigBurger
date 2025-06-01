import React from "react";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import { Card, CardBody, CardFooter } from "@heroui/card";
import { Image} from "@heroui/image";


interface OrderStepProps {
  step: {
    id: number;
    title: string;
    description: string;
    icon: string;
    image: string;
  };
  index: number;
}

export const OrderStep: React.FC<OrderStepProps> = ({ step, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="overflow-visible" disableRipple>
        <CardBody className="overflow-visible p-0">
          <Image
            removeWrapper
            alt={`Step ${step.id}: ${step.title}`}
            className="w-full object-cover h-48 rounded-t-lg"
            src={step.image}
          />
        </CardBody>
        <CardFooter className="flex flex-col items-start text-left p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-primary-100 w-8 h-8 rounded-full flex items-center justify-center">
              <span className="text-primary font-semibold">{step.id}</span>
            </div>
            <h3 className="text-xl font-semibold">{step.title}</h3>
          </div>
          <p className="text-foreground-500">{step.description}</p>
          <div className="mt-4 flex items-center text-primary">
            <Icon icon={step.icon} width={20} className="mr-2" />
            <span className="text-sm font-medium">Step {step.id}</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};