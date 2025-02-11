package com.bigburger.bigburger.services;

import com.bigburger.bigburger.exeptions.BurgerNotFoundException;
import com.bigburger.bigburger.models.BebidaModel;
import com.bigburger.bigburger.models.PapasModel;
import com.bigburger.bigburger.repository.IBebidaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class BebidaService {

    @Autowired
    private IBebidaRepository bebidaRepository;

    public BebidaModel crearBebida(BebidaModel bebidaModel) {
        // Verificar si ya existe una bebida con el mismo nombre
        Optional<BebidaModel> bebidaExistente = bebidaRepository.findBebidaByName(bebidaModel.getName());

        if (bebidaExistente.isPresent()) {
            throw new IllegalArgumentException("Ya existe una bebida con el nombre: " + bebidaModel.getName());
        }

        // Inicializar valores por defecto
        bebidaModel.setGanancia(BigDecimal.ZERO);
        bebidaModel.setPrice(BigDecimal.ZERO);
        bebidaModel.setPrivada(false);

        // Guardar la nueva bebida
        return bebidaRepository.save(bebidaModel);
    }

    public String eliminarBebida(Long id){
        bebidaRepository.deleteById(id);
        return "Bebida eliminada exitosamente";
    }

    public BebidaModel actualizarBebida(Long idBebida, BebidaModel bebidaModelBody) {
        BebidaModel bebidaModel = bebidaRepository.findById(idBebida).orElseThrow((() -> new BurgerNotFoundException("Bebida no encontrada")));
        if(!bebidaModelBody.getName().equals(bebidaModel.getName())){
            bebidaModel.setName(bebidaModelBody.getName());
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
