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
    public ElementoModel actualizarNombreElemento(Long idElemento, String nombreNuevo){
        ElementoModel elementoModel = elementoRepository.findById(idElemento)
                .orElseThrow(() -> new ElementoNotFoundException("Elemento no encontrado"));
        // Actualizar el nombre si es diferente
        if (!elementoModel.getName().equals(nombreNuevo)) {
            elementoModel.setName(nombreNuevo);
        }
        return elementoRepository.save(elementoModel);
    }
    public ElementoModel actualizarPrecioElemento(Long idElemento, ElementoModel elementoModelBody) {
        // Buscar el elemento por ID
        ElementoModel elementoModel = elementoRepository.findById(idElemento)
                .orElseThrow(() -> new ElementoNotFoundException("Elemento no encontrado"));



        // Si el precio cambia, actualizar y ajustar las burgers relacionadas
        if (elementoModel.getPrice().compareTo(elementoModelBody.getPrice()) != 0) {
            // Guardar el precio anterior
            BigDecimal precioAnterior = elementoModel.getPrice();

            // Actualizar el precio del elemento
            elementoModel.setPrice(elementoModelBody.getPrice());
            elementoRepository.save(elementoModel);

            // Obtener las papas relacionadas con este elemento
            List<PapasElementoModel> elementoPapas = papasElementoRepository.findAllByElementoModelId(idElemento);

            // Ajustar los costos de cada una de las papas afectadas
            for (PapasElementoModel papasElementoModel : elementoPapas) {
                PapasModel papasModel = papasElementoModel.getPapasModel();

                // Actualizar el costo de la burger basado en el nuevo precio
                BigDecimal costoNuevoElemento = elementoModelBody.getPrice();
                BigDecimal costoViejoElemento = precioAnterior;

                // Restar el costo antiguo y sumar el costo nuevo
                papasModel.setCosto(papasModel.getCosto().subtract(costoViejoElemento).add(costoNuevoElemento));

                // Actualizar el precio final de la burger (costo + ganancia)
                papasModel.setPrice(papasModel.getCosto().add(papasModel.getGanancia()));

                // Guardar los cambios de la burger
                papasRepository.save(papasModel);
            }

            // Obtener las burgers relacionadas con este elemento
            List<BurgerElementoModel> elementoBurgers = burgerElementoRepository.findAllByElementoModelId(idElemento);

            // Ajustar los costos de cada burger afectada
            for (BurgerElementoModel burgerElementoModel : elementoBurgers) {
                BurgerModel burgerModel = burgerElementoModel.getBurgerModel();

                // Actualizar el costo de la burger basado en el nuevo precio
                BigDecimal costoNuevoElemento = elementoModelBody.getPrice();
                BigDecimal costoViejoElemento = precioAnterior;

                // Restar el costo antiguo y sumar el costo nuevo
                burgerModel.setCosto(burgerModel.getCosto().subtract(costoViejoElemento).add(costoNuevoElemento));

                // Actualizar el precio final de la burger (costo + ganancia)
                burgerModel.setPrice(burgerModel.getCosto().add(burgerModel.getGanancia()));

                // Guardar los cambios de la burger
                burgerRepository.save(burgerModel);
            }
        }

        return elementoModel;
    }


}
