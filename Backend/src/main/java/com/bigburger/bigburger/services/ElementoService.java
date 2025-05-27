package com.bigburger.bigburger.services;

import com.bigburger.bigburger.exeptions.BurgerNotFoundException;
import com.bigburger.bigburger.exeptions.ElementoNotFoundException;
import com.bigburger.bigburger.models.*;
import com.bigburger.bigburger.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ElementoService {

    @Autowired
    private IElementoRepository elementoRepository;
    @Autowired
    private IPapasRepository papasRepository;
    @Autowired
    private IPapasElementoRepository papasElementoRepository;
    @Autowired
    private IBurgerRepository burgerRepository;
    @Autowired
    private IBurgerElementoRepository burgerElementoRepository;

    public ElementoModel crearElemento(ElementoModel elementoModel){

        if (elementoModel.getName() == null || elementoModel.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del elemento no puede estar vacío.");
        }

        Optional<ElementoModel> elementoExistente = elementoRepository.findElementoByName(elementoModel.getName());
        if (elementoExistente.isPresent()) {
            throw new IllegalArgumentException("Ya existe un elemento con el nombre: " + elementoModel.getName());
        }

        return elementoRepository.save(elementoModel);
    }

    @Transactional
    public void eliminarElemento(Long id){
        List<BurgerElementoModel> elementoBurgers = burgerElementoRepository.findAllByElementoModelId(id);
        List<PapasElementoModel> elementoPapas = papasElementoRepository.findAllByElementoModelId(id);
        for(PapasElementoModel papasElementoModel:elementoPapas){
            PapasModel papasModel = papasElementoModel.getPapasModel();
            papasModel.setCosto(papasModel.getCosto().subtract(papasElementoModel.getElementoModel().getPrice()));
            papasModel.setPrice(papasModel.getCosto());
            papasModel.setPrice(papasModel.getPrice().add(papasModel.getGanancia()));
            papasRepository.save(papasModel);
        }
        for(BurgerElementoModel burgerElementoModel:elementoBurgers){
           BurgerModel burgerModel = burgerElementoModel.getBurgerModel();
           burgerModel.setCosto(burgerModel.getCosto().subtract(burgerElementoModel.getElementoModel().getPrice()));
           burgerModel.setPrice(burgerModel.getCosto());
           burgerModel.setPrice(burgerModel.getPrice().add(burgerModel.getGanancia()));
           burgerRepository.save(burgerModel);
        }
        papasElementoRepository.deleteByElementoModelId(id);
        burgerElementoRepository.deleteByElementoModelId(id);
        elementoRepository.deleteById(id);
    }
    public List<ElementoModel> listarElementos(){
        return elementoRepository.findAll();
    }

    public ElementoModel traerUnElemento(Long idElemento){
        return elementoRepository.findById(idElemento).orElseThrow(() -> new BurgerNotFoundException("Elemento no encontrado"));
    }
    public ElementoModel actualizarNombreElemento(ElementoModel elementoModel, ElementoModel elementoModelBody) {
        String nuevoNombre = elementoModelBody.getName();
        // Verificar que el nuevo nombre no sea null y no sea solo espacios en blanco
        if (nuevoNombre != null && !nuevoNombre.trim().isEmpty() && !nuevoNombre.equals(elementoModel.getName())) {
            elementoModel.setName(nuevoNombre);
        }
        return elementoRepository.save(elementoModel);
    }

    public ElementoModel actualizarPrecioElemento(ElementoModel elementoModel, ElementoModel elementoModelBody) {
        BigDecimal nuevoPrecio = elementoModelBody.getPrice();
        // Verificar que el nuevo precio no sea null, sea mayor o igual a 0 y diferente del actual
        if (nuevoPrecio != null && nuevoPrecio.compareTo(BigDecimal.ZERO) >= 0 && elementoModel.getPrice().compareTo(nuevoPrecio) != 0) {
            // Guardar el precio anterior
            BigDecimal precioAnterior = elementoModel.getPrice();
            // Actualizar el precio del elemento
            elementoModel.setPrice(nuevoPrecio);
            elementoRepository.save(elementoModel);

            // Ajuste de las papas relacionadas
            List<PapasElementoModel> elementoPapas = papasElementoRepository.findAllByElementoModelId(elementoModel.getId());
            for (PapasElementoModel papasElementoModel : elementoPapas) {
                PapasModel papasModel = papasElementoModel.getPapasModel();
                // Restar el costo antiguo y sumar el costo nuevo
                papasModel.setCosto(papasModel.getCosto().subtract(precioAnterior).add(nuevoPrecio));
                // Actualizar el precio final de la burger (costo + ganancia)
                papasModel.setPrice(papasModel.getCosto().add(papasModel.getGanancia()));
                papasRepository.save(papasModel);
            }

            // Ajuste de las burgers relacionadas
            List<BurgerElementoModel> elementoBurgers = burgerElementoRepository.findAllByElementoModelId(elementoModel.getId());
            for (BurgerElementoModel burgerElementoModel : elementoBurgers) {
                BurgerModel burgerModel = burgerElementoModel.getBurgerModel();
                // Restar el costo antiguo y sumar el costo nuevo
                burgerModel.setCosto(burgerModel.getCosto().subtract(precioAnterior).add(nuevoPrecio));
                // Actualizar el precio final de la burger (costo + ganancia)
                burgerModel.setPrice(burgerModel.getCosto().add(burgerModel.getGanancia()));
                burgerRepository.save(burgerModel);
            }
        }
        return elementoModel;
    }

    public ElementoModel actualizarElemento(Long idElemento, ElementoModel elementoModelBody) {
        ElementoModel elementoModel = elementoRepository.findById(idElemento)
                .orElseThrow(() -> new BurgerNotFoundException("Elemento no encontrado"));

        elementoModel = this.actualizarNombreElemento(elementoModel, elementoModelBody);
        elementoModel = this.actualizarPrecioElemento(elementoModel, elementoModelBody);

        return elementoModel;
    }


}
