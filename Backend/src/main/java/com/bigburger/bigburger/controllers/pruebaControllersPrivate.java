package com.bigburger.bigburger.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/private")
public class pruebaControllersPrivate {


    @GetMapping("/mostrarTodasLasVentas")
    @PreAuthorize("hasAnyAuthority('READ','CREATE')")
    public String mostrarTodasLasVentas(){
        return "Mostrar Ventas";
    }
    @PostMapping("/crearHamburguesa")
    @PreAuthorize("hasAuthority('CREATE')")
    public String crearHamburguesa(){
        return "Se ha creado la hamburguesa correctamente";
    }
    @GetMapping("/eliminarHamburguesa")
    @PreAuthorize("hasAuthority('DELETE')")
    public String eliminarHamburguesa(){
        return "Se ha eliminado la hamburguesa correctamente";
    }
}
