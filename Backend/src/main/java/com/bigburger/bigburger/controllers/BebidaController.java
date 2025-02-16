package com.bigburger.bigburger.controllers;

import com.bigburger.bigburger.dto.BebidaDto;
import com.bigburger.bigburger.dto.ElementoDtoForEdit;
import com.bigburger.bigburger.models.BebidaModel;
import com.bigburger.bigburger.services.BebidaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/bebida")
public class BebidaController {

    @Autowired
    private BebidaService bebidaService;

    @PutMapping("/cambiarImagenBebida")
    @PreAuthorize("hasAuthority('UPDATE')")
    public ResponseEntity<BebidaModel> cambiarImagenBebida(@RequestParam Long id, @RequestParam("file") MultipartFile foto) {
        return ResponseEntity.ok(bebidaService.cambiarImagenBebida(id, foto));
    }

    @PostMapping("/crearBebida")
    @PreAuthorize("hasAuthority('CREATE')")
    public ResponseEntity<BebidaModel> crearBebida(@RequestBody BebidaModel bebidaModel) {
        return ResponseEntity.ok(bebidaService.crearBebida(bebidaModel));
    }

    @GetMapping("/listarUnaBebidaADMIN")
    @PreAuthorize("hasAuthority('READ')")
    public BebidaModel listarUnaBebidaADMIN(@RequestParam Long id) {
        return bebidaService.listarUnaBebidaADMIN(id);
    }

    @GetMapping("/listarBebidaAuth")
    @PreAuthorize("hasAuthority('READ')")
    public List<BebidaModel> listarBebidaADMIN() {
        return bebidaService.listarBebidaADMIN();
    }

    @GetMapping("/listarBebida")
    @PreAuthorize("permitAll()")
    public List<BebidaDto> listarBebida() {
        return bebidaService.listarBebida();
    }

    @DeleteMapping("/eliminarBebida")
    @PreAuthorize("hasAuthority('DELETE')")
    public String eliminarBebida(@RequestParam Long id) {
        return bebidaService.eliminarBebida(id);
    }

//    @PutMapping(value = "/actualizarBebida/{idBebida}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
//    @PreAuthorize("hasAuthority('UPDATE')")
//    public ResponseEntity<BebidaModel> actualizarBebida(
//            @PathVariable Long idBebida,
//            @RequestPart("bebidaModelBody") @Valid BebidaModel bebidaModelBody,  // Objeto JSON
//            @RequestPart(value = "file", required = false) MultipartFile file,  // Archivo opcional
//            @RequestPart(value = "elementosAgregados", required = false) List<ElementoDtoForEdit> elementosAgregados,
//            @RequestPart(value = "elementosEliminados", required = false) List<ElementoDtoForEdit> elementosEliminados) {
//
//        return ResponseEntity.ok(bebidaService.actualizarBebida(idBebida, bebidaModelBody, file, elementosAgregados, elementosEliminados));
//    }

    @PutMapping("/asignarCostoBebida")
    @PreAuthorize("hasAuthority('UPDATE')")
    public ResponseEntity<BebidaModel> asignarCostoBebida(@RequestParam Long idBebida, @RequestParam BigDecimal costo) {
        return ResponseEntity.ok(bebidaService.asignarGananciaBebida(idBebida, costo));
    }

    @PutMapping("/asignarGananciaBebida")
    @PreAuthorize("hasAuthority('UPDATE')")
    public ResponseEntity<BebidaModel> asignarGananciaBebida(@RequestParam Long idBebida, @RequestParam BigDecimal ganancia) {
        return ResponseEntity.ok(bebidaService.asignarGananciaBebida(idBebida, ganancia));
    }
}