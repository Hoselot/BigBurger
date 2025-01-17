package com.bigburger.bigburger.exeptions;

public class ElementoNotFoundException extends RuntimeException{
    public ElementoNotFoundException(String message) {
        super(message);
    }
}
