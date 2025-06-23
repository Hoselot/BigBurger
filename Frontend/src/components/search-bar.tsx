import React from 'react';
import { Input } from "@heroui/input";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

export const SearchBar: React.FC<{
  onSearch: (value: string) => void;
  onExpand: () => void;
}> = ({ onSearch, onExpand }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleExpand = () => {
    setIsExpanded(true);
    onExpand();
    // Focus the input after expansion
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleBlur = () => {
    if (searchTerm === '') {
      setIsExpanded(false);
    }
  };

  return (
    <div className="relative z-10">
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 top-0 w-full"
          >
            <Input
              ref={inputRef}
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              startContent={<Icon icon="lucide:search" className="text-default-400" />}
              className="w-full"
              onBlur={handleBlur}
            />
          </motion.div>
        ) : (
          <button
            className="p-2 rounded-full bg-default-100 hover:bg-default-200 transition-colors"
            onClick={handleExpand}
          >
            <Icon icon="lucide:search" className="text-default-500" width={24} height={24} />
          </button>
        )}
      </AnimatePresence>
    </div>
  );
};