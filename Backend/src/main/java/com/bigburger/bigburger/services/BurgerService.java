package com.bigburger.bigburger.services;

import com.bigburger.bigburger.dto.BurgerDto;
import com.bigburger.bigburger.exeptions.BurgerNotFoundException;
import com.bigburger.bigburger.exeptions.ElementoNotFoundException;
import com.bigburger.bigburger.models.BurgerElementoModel;
import com.bigburger.bigburger.models.BurgerModel;
import com.bigburger.bigburger.models.ElementoModel;
import com.bigburger.bigburger.repository.IBurgerElementoRepository;
import com.bigburger.bigburger.repository.IBurgerRepository;
import com.bigburger.bigburger.repository.IElementoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BurgerService {

    @Autowired
    private IBurgerRepository burgerRepository;
    @Autowired
    private IElementoRepository elementoRepository;
    @Autowired
    private IBurgerElementoRepository burgerElementoRepository;
    @Autowired
    private ImageService imageService;

    public BurgerModel cambiarImagenHamburguesa(Long idBurger, MultipartFile file){
        BurgerModel burgerModel = burgerRepository.findById(idBurger).orElseThrow((() -> new BurgerNotFoundException("Hamburguesa no encontrada")));
        burgerModel.setPictureUrl(imageService.uploadImage(file));
        return burgerRepository.save(burgerModel);
    }

    public List<BurgerModel> listarHamburguesasADMIN(){
        return burgerRepository.findAll();
    }

    public List<BurgerDto> listarHamburguesas() {
        return burgerRepository.findAll().stream()
                .map(burger -> new BurgerDto(
                        burger.getId(),
                        burger.getName(),
                        burger.getDescription(),
                        burger.getPictureUrl(),
                        burger.getPrice()
                ))
                .collect(Collectors.toList());
    }

    public BurgerModel crearHamburguesa(BurgerModel burgerModel){
        burgerModel.setGanancia(BigDecimal.valueOf(0));
        burgerModel.setPrice(BigDecimal.valueOf(0));
        burgerModel.setCosto(BigDecimal.valueOf(0));
        return burgerRepository.save(burgerModel);
    }

    public String eliminarHamburguesa(Long id){
        burgerRepository.deleteById(id);
        return "Hamburguesa eliminada exitosamente";
    }

    public BurgerModel actualizarHamburguesa(Long idBurger, BurgerModel burgerModelBody) {
        BurgerModel burgerModel = burgerRepository.findById(idBurger).orElseThrow((() -> new BurgerNotFoundException("Hamburguesa no encontrada")));
        if(!burgerModelBody.getName().equals(burgerModel.getName())){
            burgerModel.setName(burgerModelBody.getName());
        }
        if (!burgerModel.getDescription().equals(burgerModelBody.getDescription())){
            burgerModel.setDescription(burgerModelBody.getDescription());
        }
        return burgerRepository.save(burgerModel);
    }

    public BurgerElementoModel agregarElementoBurger(Long idBurger, Long idElemento){
        ElementoModel elementoModel = elementoRepository.findById(idElemento).orElseThrow(() -> new ElementoNotFoundException("Elemento no encontrado"));
        BurgerModel burgerModel = burgerRepository.findById(idBurger).orElseThrow((() -> new BurgerNotFoundException("Hamburguesa no encontrada")));
        BurgerElementoModel burgerElementoModel = new BurgerElementoModel(burgerModel,elementoModel);
        burgerModel.setCosto(burgerModel.getCosto().add(elementoModel.getPrice()));
        burgerModel.setPrice(burgerModel.getCosto());
        burgerModel.setPrice(burgerModel.getPrice().add(burgerModel.getGanancia()));
        burgerRepository.save(burgerModel);
        return burgerElementoRepository.save(burgerElementoModel);
    }

    public List<BurgerElementoModel> eliminarElementoBurger(Long idBurger, Long idElemento){
        List<BurgerElementoModel> burgerElementoList = burgerElementoRepository.findAllByBurgerModelIdAndElementoModelId(idBurger, idElemento);

        if (burgerElementoList.isEmpty()) {
            return null; // Si no hay elementos, no se hace nada y se retorna null
        }

        // Obtener el último elemento de la lista
        BurgerElementoModel lastElement = burgerElementoList.get(burgerElementoList.size() - 1);
        lastElement.getBurgerModel().setCosto(lastElement.getBurgerModel().getCosto().subtract(lastElement.getElementoModel().getPrice()));
        lastElement.getBurgerModel().setPrice(lastElement.getBurgerModel().getCosto());
        lastElement.getBurgerModel().setPrice(lastElement.getBurgerModel().getPrice().add(lastElement.getBurgerModel().getGanancia()));
        burgerRepository.save(lastElement.getBurgerModel());
        // Eliminar el último elemento
        burgerElementoRepository.delete(lastElement);
        return burgerElementoRepository.findAllByBurgerModelIdAndElementoModelId(idBurger, idElemento);
    }

    public List<BurgerElementoModel> listarElementosBurger(Long idBurger) {
        return burgerElementoRepository.findAllByBurgerModelId(idBurger);
    }

    public BurgerModel asignarGananciaHamburguesa(Long idBurger, BigDecimal ganancia){
        BurgerModel burgerModel = burgerRepository.findById(idBurger).orElseThrow((() -> new BurgerNotFoundException("Hamburguesa no encontrada")));
        burgerModel.setGanancia(ganancia);
        burgerModel.setPrice(burgerModel.getCosto());
        burgerModel.setPrice(burgerModel.getPrice().add(ganancia));
        return burgerRepository.save(burgerModel);
    }
}
