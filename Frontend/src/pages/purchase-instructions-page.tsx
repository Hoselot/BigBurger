import DefaultLayout from "@/layouts/default";
import { Divider } from "@heroui/divider";

import { motion } from "framer-motion";
import { Hero } from "../components/Hero";
import { OrderStep } from "../components/OrderStep";
import { CallToAction } from "../components/CallToAction";

const steps = [
  {
    id: 1,
    title: "Browse Our Menu",
    description: "Explore our wide selection of delicious options, from signature burgers to fresh salads and tasty sides.",
    icon: "lucide:menu",
    image: "https://img.heroui.chat/image/food?w=600&h=400&u=step1"
  },
  {
    id: 2,
    title: "Customize Your Order",
    description: "Personalize your meal with toppings, sides, and special requests to make it exactly how you like it.",
    icon: "lucide:settings",
    image: "https://img.heroui.chat/image/food?w=600&h=400&u=step2"
  },
  {
    id: 3,
    title: "Review & Checkout",
    description: "Double-check your selections, add any special instructions, and proceed to our secure payment process.",
    icon: "lucide:check-circle",
    image: "https://img.heroui.chat/image/food?w=600&h=400&u=step3"
  },
  {
    id: 4,
    title: "Track Your Delivery",
    description: "Follow your order in real-time as it's prepared and delivered straight to your door.",
    icon: "lucide:map-pin",
    image: "https://img.heroui.chat/image/food?w=600&h=400&u=step4"
  }
];

export default function IntructionsPage() {
  return (
    <DefaultLayout>
        <div className="min-h-screen bg-background">
            <main className="w-full">
                <Hero />
                
                <section className="w-full max-w-7xl mx-auto px-4 py-16 md:py-24">
                <div className="text-center mb-12">
                    <motion.h2 
                    className="text-3xl md:text-4xl font-semibold mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    >
                    Simple Steps to Place Your Order
                    </motion.h2>
                    <motion.p 
                    className="text-foreground-500 text-lg max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    >
                    We've made ordering your favorite meals quick and easy. Just follow these simple steps.
                    </motion.p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {steps.map((step, index) => (
                    <OrderStep 
                        key={step.id}
                        step={step}
                        index={index}
                    />
                    ))}
                </div>
                </section>
                
                <Divider className="my-8" />
                
                <CallToAction />
            </main>
        </div>
    </DefaultLayout>
  );
}