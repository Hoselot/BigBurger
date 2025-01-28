package com.bigburger.bigburger.controllers;

import com.bigburger.bigburger.models.BurgerModel;
import com.bigburger.bigburger.models.ElementoModel;
import com.bigburger.bigburger.services.ElementoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/elemento")
public class ElementoController {

    @Autowired
    private ElementoService elementoService;

    @PostMapping("/crearElemento")
    @PreAuthorize("hasAuthority('CREATE')")
    public ResponseEntity<ElementoModel> crearElemento(@RequestBody ElementoModel elementoModel){
        return ResponseEntity.ok(elementoService.crearElemento(elementoModel));
    }

    @DeleteMapping("/eliminarElemento")
    @PreAuthorize("hasAuthority('DELETE')")
    public void eliminarElemento(Long id){
        elementoService.eliminarElemento(id);
    }

    @GetMapping("/listarElementos")
    @PreAuthorize("hasAuthority('READ')")
    public List<ElementoModel> listarElementos(){
        return elementoService.listarElementos();
    }

    @PutMapping("/actualizarPrecioElemento")
    @PreAuthorize("hasAuthority('UPDATE')")
    public ResponseEntity<ElementoModel> actualizarPrecioElemento(@RequestParam Long idElemento, @RequestBody ElementoModel elementoModel){
        return ResponseEntity.ok(elementoService.actualizarPrecioElemento(idElemento,elementoModel));
    }
    @PutMapping("/actualizarNombreElemento")
    @PreAuthorize("hasAuthority('UPDATE')")
    public ResponseEntity<ElementoModel> actualizarNombreElemento(@RequestParam Long idElemento, @RequestParam String nombreNuevo){
        return ResponseEntity.ok(elementoService.actualizarNombreElemento(idElemento,nombreNuevo));
    }
}
