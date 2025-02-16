package com.bigburger.bigburger.controllers;

import com.bigburger.bigburger.dto.PapasDto;
import com.bigburger.bigburger.dto.ElementoDtoForEdit;
import com.bigburger.bigburger.models.PapasElementoModel;
import com.bigburger.bigburger.models.PapasModel;
import com.bigburger.bigburger.services.PapasService;
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
@RequestMapping("/papas")
public class PapasController {

    @Autowired
    private PapasService papasService;


    @PutMapping("/cambiarImagenPapas")
    @PreAuthorize("hasAuthority('UPDATE')")
    public ResponseEntity<PapasModel> cambiarImagenPapas(@RequestParam Long id, @RequestParam("file") MultipartFile foto){
        return ResponseEntity.ok(papasService.cambiarImagenPapas(id, foto));
    }

    @PostMapping("/crearPapas")
    @PreAuthorize("hasAuthority('CREATE')")
    public ResponseEntity<PapasModel> crearPapas(@RequestBody PapasModel papasModel){
        return ResponseEntity.ok(papasService.crearPapas(papasModel));
    }

    @GetMapping("/listarUnaPapasADMIN")
    @PreAuthorize("hasAuthority('READ')")
    public PapasModel listarUnaPapasADMIN(@RequestParam Long id){
        return papasService.listarUnaPapasADMIN(id);
    }

    @GetMapping("/listarPapasAuth")
    @PreAuthorize("hasAuthority('READ')")
    public List<PapasModel> listarPapasADMIN(){
        return papasService.listarPapasADMIN();
    }

    @GetMapping("/listarPapas")
    @PreAuthorize("permitAll()")
    public List<PapasDto> listarPapas(){
        return papasService.listarPapas();
    }

    @DeleteMapping("/eliminarPapas")
    @PreAuthorize("hasAuthority('DELETE')")
    public String eliminarPapas(@RequestParam Long id){
        return papasService.eliminarPapas(id);
    }
    @PutMapping(value = "/actualizarPapas/{idPapas}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasAuthority('UPDATE')")
    public ResponseEntity<PapasModel> actualizarPapas(
            @PathVariable Long idPapas,
            @RequestPart("papasModelBody") @Valid PapasModel papasModelBody,  // Objeto JSON
            @RequestPart(value = "file", required = false) MultipartFile file,  // Archivo opcional
            @RequestPart(value = "elementosAgregados", required = false) List<ElementoDtoForEdit> elementosAgregados,
            @RequestPart(value = "elementosEliminados", required = false) List<ElementoDtoForEdit> elementosEliminados) {

        return ResponseEntity.ok(papasService.actualizarPapas(idPapas, papasModelBody, file, elementosAgregados, elementosEliminados));
    }

    @PostMapping("/agregarElementoPapas")
    @PreAuthorize("hasAuthority('CREATE')")
    public PapasElementoModel agregarElementoPapas(Long idPapas, Long idElemento){
        return papasService.agregarElementoPapas(idPapas,idElemento);
    }

    @GetMapping("/listarElementosPapas")
    @PreAuthorize("hasAuthority('READ')")
    public List<PapasElementoModel> listarElementosPapas(Long idPapas){
        return papasService.listarElementosPapas(idPapas);
    }

    @DeleteMapping("/eliminarElementoPapas")
    @PreAuthorize("hasAuthority('DELETE')")
    public ResponseEntity<List<PapasElementoModel>> eliminarElementoPapas(@RequestParam Long idPapas,@RequestParam Long idElemento){
        return ResponseEntity.ok(papasService.eliminarElementoPapas(idPapas,idElemento));
    }
    @PutMapping("/asignarGananciaPapas")
    @PreAuthorize("hasAuthority('UPDATE')")
    public ResponseEntity<PapasModel> asignarGananciaPapas(@RequestParam Long idPapas, @RequestParam BigDecimal ganancia){
        return ResponseEntity.ok(papasService.asignarGananciaPapas(idPapas,ganancia));
    }

}
