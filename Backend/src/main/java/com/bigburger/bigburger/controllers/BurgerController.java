package com.bigburger.bigburger.controllers;

import com.bigburger.bigburger.models.BurgerModel;
import com.bigburger.bigburger.services.BurgerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/burger")
public class BurgerController {

    @Autowired
    private BurgerService burgerService;

    @PostMapping("/crearHamburguesa")
    @PreAuthorize("hasAuthority('CREATE')")
    public String crearHamburguesa(@RequestBody BurgerModel burgerModel){
        return burgerService.crearHamburguesa(burgerModel);
    }

    @GetMapping("/listarHamburguesas")
    @PreAuthorize("permitAll()")
    public List<BurgerModel> listarHamburguesas(){
        return burgerService.listarHamburguesas();
    }

    @DeleteMapping("/eliminarHamburguesa")
    @PreAuthorize("hasAuthority('DELETE')")
    public String eliminarHamburguesa(@RequestParam Long id){
        return burgerService.eliminarHamburguesa(id);
    }

    @PutMapping("/actualizarHamburguesa")
    @PreAuthorize("hasAuthority('UPDATE')")
    public String actualizarHamburguesa(@RequestParam String nombreOriginal, @RequestParam String nombreNuevo,
                                        @RequestParam String descripcion, @RequestParam BigDecimal price){
        return burgerService.actualizarHamburguesa(nombreOriginal,nombreNuevo,descripcion,price);
    }

}
