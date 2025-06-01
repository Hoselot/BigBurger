import React from "react";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export const CallToAction: React.FC = () => {
  return (
    <section className="w-full bg-primary-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Ready to Place Your Order?</h2>
          <p className="text-foreground-500 text-lg mb-8">
            It's time to enjoy your favorite meal. Our chefs are ready to prepare your order with the freshest ingredients.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              color="primary" 
              size="lg"
              endContent={<Icon icon="lucide:shopping-cart" width={20} />}
              className="font-medium w-full sm:w-auto"
            >
              Start Your Order Now
            </Button>
            <Button 
              variant="flat" 
              size="lg"
              startContent={<Icon icon="lucide:phone" width={20} />}
              className="font-medium w-full sm:w-auto"
            >
              Call for Assistance
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "lucide:clock", title: "Fast Delivery", description: "Get your order in 30 minutes or less" },
              { icon: "lucide:shield", title: "Secure Payment", description: "Multiple safe payment options" },
              { icon: "lucide:heart", title: "Quality Guarantee", description: "Fresh ingredients, delicious results" }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-background rounded-lg p-6 shadow-sm"
              >
                <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon icon={feature.icon} className="text-primary" width={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-foreground-500 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};