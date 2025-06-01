import React from "react";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full bg-gradient-to-b from-primary-50 to-background py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center">
        <motion.div 
          className="w-full md:w-1/2 mb-8 md:mb-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            How to <span className="text-primary">Order</span>
          </h1>
          <p className="text-foreground-600 text-lg md:text-xl mb-6 max-w-lg">
            Placing an order with us is quick and simple. Follow our easy step-by-step process to get your favorite meals delivered to your doorstep.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              color="primary" 
              size="lg"
              endContent={<Icon icon="lucide:arrow-right" width={20} />}
              className="font-medium"
            >
              Start Your Order
            </Button>
            <Button 
              variant="bordered" 
              size="lg"
              startContent={<Icon icon="lucide:info" width={20} />}
              className="font-medium"
            >
              Learn More
            </Button>
          </div>
        </motion.div>
        
        <motion.div 
          className="w-full md:w-1/2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative h-[300px] md:h-[400px] w-full">
            <div className="absolute top-0 right-0 w-full h-full rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://img.heroui.chat/image/food?w=800&h=600&u=hero" 
                alt="Delicious food being prepared" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-lg shadow-lg hidden md:block">
              <div className="flex items-center gap-3">
                <div className="bg-success-100 p-2 rounded-full">
                  <Icon icon="lucide:check" className="text-success" width={20} />
                </div>
                <p className="font-medium">Fast & Easy Ordering</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
          className="w-full h-[60px] md:h-[100px]"
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            className="fill-background"
          ></path>
        </svg>
      </div>
    </section>
  );
};