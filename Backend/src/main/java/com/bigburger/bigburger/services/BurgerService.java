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
                        burger.getPrice()
                ))
                .collect(Collectors.toList());
    }

    public String crearHamburguesa(BurgerModel burgerModel){
        burgerModel.setGanancia(BigDecimal.valueOf(0));
        burgerModel.setPrice(BigDecimal.valueOf(0));
        burgerModel.setCosto(BigDecimal.valueOf(0));
        burgerRepository.save(burgerModel);
        return "Hamburguesa creada exitosamente";
    }

    public String eliminarHamburguesa(Long id){
        burgerRepository.deleteById(id);
        return "Hamburguesa eliminada exitosamente";
    }

//    public String actualizarHamburguesa(String nombreOriginal, String nombreNuevo, String descripcion, BigDecimal price) {
//
//        BurgerModel burgerModelBD = burgerRepository.findBurgerByName(nombreOriginal)
//                .orElseThrow(() -> new BurgerNotFoundException("No existe una hamburguesa con el nombre: " + nombreOriginal));
//
//        // Actualiza solo si hay cambios
//        boolean updated = false;
//
//        /*
//        burgerModelBD.getName(): Obtiene el nombre actual de la hamburguesa desde el objeto burgerModelBD.
//        equals(nombreNuevo): Compara el nombre actual con el nuevo nombre proporcionado para ver si son iguales.
//        ! (Negación lógica): Invierte el resultado de la comparación. Si los nombres son iguales, equals() devuelve true,
//        pero con ! se convierte en false. Si los nombres son diferentes, equals() devuelve false, y con ! se convierte en true.*/
//        if (!burgerModelBD.getName().equals(nombreNuevo)) {
//            burgerModelBD.setName(nombreNuevo);
//            updated = true;
//        }
//        if (!burgerModelBD.getDescription().equals(descripcion)) {
//            burgerModelBD.setDescription(descripcion);
//            updated = true;
//        }
//
//        /*
//            burgerModelBD.getPrice(): Obtiene el precio actual de la hamburguesa desde el objeto burgerModelBD.
//            price: Es el precio nuevo que se desea establecer para la hamburguesa.
//            compareTo(price): Es un método de la clase BigDecimal (que es el tipo de price y burgerModelBD.getPrice()) que compara
//            el valor del objeto BigDecimal (el precio actual de la hamburguesa) con otro objeto BigDecimal (el nuevo precio).
//            Devuelve 0 si ambos valores son iguales.
//            Devuelve un número negativo si el precio actual es menor que el nuevo precio.
//            Devuelve un número positivo si el precio actual es mayor que el nuevo precio.
//            != 0: Verifica si el valor de compareTo no es igual a cero. Es decir, verifica si el precio actual de la hamburguesa
//            es diferente al nuevo precio.*/
//        if (burgerModelBD.getPrice().compareTo(price) != 0) {
//            burgerModelBD.setPrice(price);
//            updated = true;
//        }
//
//        if (updated) {
//            burgerRepository.save(burgerModelBD);
//            return "Hamburguesa modificada exitosamente";
//        }
//
//        return "No se realizaron cambios en la hamburguesa";
//    }

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
