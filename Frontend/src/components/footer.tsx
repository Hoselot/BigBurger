import React from "react";
import { Link,  } from "@heroui/link";
import {Divider} from "@heroui/divider";

import {Spacer} from "@heroui/spacer";

import { FaInstagram } from 'react-icons/fa';
import { FaFacebook } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";

export interface FooterProps {
  siteName?: string;
  logoSrc?: string;
}

export const Footer: React.FC<FooterProps> = ({
  siteName = "HeroUI",
  logoSrc,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-content1 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Logo/Site Name */}
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              {logoSrc ? (
                <img 
                  src={logoSrc} 
                  alt={`${siteName} logo`} 
                  className="h-8 w-auto mr-2" 
                />
              ) : (
                <FaXTwitter 
                   
                  className="text-primary h-6 w-6 mr-2" 
                  aria-hidden="true" 
                />
              )}
              <span className="text-lg font-semibold text-foreground">{siteName}</span>
            </div>
            <Spacer y={2} />
            <p className="text-small text-foreground-500 max-w-xs">
              Creating beautiful, accessible user interfaces with modern design principles.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 md:gap-12">
            <div>
              <h3 className="text-medium font-medium text-foreground mb-3">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" color="foreground" underline="hover">Home</Link>
                </li>
                <li>
                  <Link href="/products" color="foreground" underline="hover">Products</Link>
                </li>
                <li>
                  <Link href="/about" color="foreground" underline="hover">About Us</Link>
                </li>
                <li>
                  <Link href="/contact" color="foreground" underline="hover">Contact</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-medium font-medium text-foreground mb-3">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" color="foreground" underline="hover">Blog</Link>
                </li>
                <li>
                  <Link href="/docs" color="foreground" underline="hover">Documentation</Link>
                </li>
                <li>
                  <Link href="/support" color="foreground" underline="hover">Support</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-medium font-medium text-foreground mb-3">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" color="foreground" underline="hover">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms" color="foreground" underline="hover">Terms of Service</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-medium font-medium text-foreground mb-3">Connect</h3>
              <div className="flex space-x-4">
                <Link 
                  isExternal 
                  href="https://facebook.com" 
                  aria-label="Facebook"
                  className="text-foreground-500 hover:text-primary transition-colors"
                >
                  < FaFacebook  className="h-5 w-5" />
                </Link>
                <Link 
                  isExternal 
                  href="https://instagram.com" 
                  aria-label="Instagram"
                  className="text-foreground-500 hover:text-primary transition-colors"
                >
                  <FaInstagram   className="h-5 w-5" />
                </Link>
                <Link 
                  isExternal 
                  href="https://twitter.com" 
                  aria-label="Twitter"
                  className="text-foreground-500 hover:text-primary transition-colors"
                >
                  <FaXTwitter  className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Divider className="my-8" />
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <p className="text-small text-foreground-500">
            &copy; {currentYear} {siteName}. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-small text-foreground-500">
              Designed with <span className="text-danger">❤</span> using HeroUI
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};