package com.bigburger.bigburger.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@PreAuthorize("permitAll()")
@RequestMapping("/public")
public class pruebaControllersPublic {

    @GetMapping("/pagar")
    public String pagar(){
        return "Su pago se a realizado correctamente";
    }
    @GetMapping("/cancelar")
    public String cancelar(){
        return "Su pedido se a cancelado correctamente";
    }
}
