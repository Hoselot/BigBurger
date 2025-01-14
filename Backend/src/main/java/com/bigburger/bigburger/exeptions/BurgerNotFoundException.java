package com.bigburger.bigburger.exeptions;

public class BurgerNotFoundException extends RuntimeException{
    public BurgerNotFoundException(String message) {
        super(message);
    }
}
