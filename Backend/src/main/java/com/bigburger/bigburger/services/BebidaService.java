package com.bigburger.bigburger.services;

import com.bigburger.bigburger.dto.BebidaDto;
import com.bigburger.bigburger.dto.ElementoDtoForEdit;
import com.bigburger.bigburger.dto.PapasDto;
import com.bigburger.bigburger.exeptions.BurgerNotFoundException;
import com.bigburger.bigburger.models.BebidaModel;
import com.bigburger.bigburger.models.PapasModel;
import com.bigburger.bigburger.repository.IBebidaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BebidaService {

    @Autowired
    private IBebidaRepository bebidaRepository;
    @Autowired
    private ImageService imageService;

    public BebidaModel cambiarImagenBebida(Long idBebida, MultipartFile file){
        BebidaModel bebidaModel = bebidaRepository.findById(idBebida).orElseThrow((() -> new BurgerNotFoundException("Bebida no encontrada")));
        bebidaModel.setPictureUrl(imageService.uploadImage(file));
        return bebidaRepository.save(bebidaModel);
    }

    public BebidaModel crearBebida(BebidaModel bebidaModel) {
        if (bebidaModel.getName() == null || bebidaModel.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la bebida no puede estar vacío.");
        }

        // Verificar si ya existe una bebida con el mismo nombre
        Optional<BebidaModel> bebidaExistente = bebidaRepository.findBebidaByName(bebidaModel.getName());
        if (bebidaExistente.isPresent()) {
            throw new IllegalArgumentException("Ya existe una bebida con el nombre: " + bebidaModel.getName());
        }

        // Inicializar valores por defecto si no están asignados
        if (bebidaModel.getCosto() == null) {
            bebidaModel.setCosto(BigDecimal.ZERO);
        }
        if (bebidaModel.getGanancia() == null) {
            bebidaModel.setGanancia(BigDecimal.ZERO);
        }
        if (bebidaModel.getPrice() == null) {
            bebidaModel.setPrice(BigDecimal.ZERO);
        }
        if (bebidaModel.getPrivada() == null) {
            bebidaModel.setPrivada(false);
        }

        // Guardar la nueva bebida
        return bebidaRepository.save(bebidaModel);
    }


    public String eliminarBebida(Long id){
        bebidaRepository.deleteById(id);
        return "Bebida eliminada exitosamente";
    }

    public BebidaModel listarUnaBebidaADMIN(Long id){
        return bebidaRepository.findById(id).orElseThrow((() -> new BurgerNotFoundException("Bebida no encontrada")));
    }

    public List<BebidaModel> listarBebidaADMIN(){
        return bebidaRepository.findAll();
    }

    public List<BebidaDto> listarBebida() {
        return bebidaRepository.findAll().stream()
                .map(bebida -> new BebidaDto(
                        bebida.getId(),
                        bebida.getName(),
                        bebida.getPictureUrl(),
                        bebida.getPrice()
                ))
                .collect(Collectors.toList());
    }

    public BebidaModel actualizarBebida(Long idBebida, BebidaModel bebidaModelBody, MultipartFile imagen) {

        BebidaModel bebidaModel = bebidaRepository.findById(idBebida)
                .orElseThrow(() -> new BurgerNotFoundException("Papas no encontradas"));

        if (bebidaModelBody.getName() != null && !bebidaModelBody.getName().trim().isEmpty() && !Objects.equals(bebidaModelBody.getName(), bebidaModel.getName())) {
            bebidaModel.setName(bebidaModelBody.getName());
        }

        if (imagen != null) {
            String newPictureUrl = imageService.uploadImage(imagen);
            if (newPictureUrl != null && !newPictureUrl.isEmpty()) {
                bebidaModel.setPictureUrl(newPictureUrl);
            }
        }

        if (bebidaModelBody.getGanancia() != null && bebidaModelBody.getGanancia().compareTo(BigDecimal.ZERO) > 0) {
            asignarGananciaBebida(idBebida, bebidaModelBody.getGanancia());
        }

        return bebidaRepository.save(bebidaModel);
    }

    public BebidaModel asignarCostoBebida(Long idPapas, BigDecimal costo){
        BebidaModel bebidaModel = bebidaRepository.findById(idPapas).orElseThrow((() -> new BurgerNotFoundException("Bebida no encontrada")));
        bebidaModel.setCosto(costo);
        bebidaModel.setPrice(bebidaModel.getGanancia());
        bebidaModel.setPrice(bebidaModel.getPrice().add(costo));
        return bebidaRepository.save(bebidaModel);
    }

    public BebidaModel asignarGananciaBebida(Long idPapas, BigDecimal ganancia){
        BebidaModel bebidaModel = bebidaRepository.findById(idPapas).orElseThrow((() -> new BurgerNotFoundException("Bebida no encontrada")));
        bebidaModel.setGanancia(ganancia);
        bebidaModel.setPrice(bebidaModel.getCosto());
        bebidaModel.setPrice(bebidaModel.getPrice().add(ganancia));
        return bebidaRepository.save(bebidaModel);
    }
}
