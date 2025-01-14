package com.bigburger.bigburger.services;

import com.bigburger.bigburger.exeptions.BurgerNotFoundException;
import com.bigburger.bigburger.models.BurgerModel;
import com.bigburger.bigburger.repository.IBurgerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BurgerService {

    @Autowired
    private IBurgerRepository burgerRepository;

    public List<BurgerModel> listarHamburguesas(){
        return burgerRepository.findAll();
    }

    public String crearHamburguesa(BurgerModel burgerModel){
        burgerRepository.save(burgerModel);
        return "Hamburguesa creada exitosamente";
    }

    public String eliminarHamburguesa(Long id){
        burgerRepository.deleteById(id);
        return "Hamburguesa eliminada exitosamente";
    }

    public String actualizarHamburguesa(String nombreOriginal, String nombreNuevo, String descripcion, BigDecimal price) {

        BurgerModel burgerModelBD = burgerRepository.findBurgerByName(nombreOriginal)
                .orElseThrow(() -> new BurgerNotFoundException("No existe una hamburguesa con el nombre: " + nombreOriginal));

        // Actualiza solo si hay cambios
        boolean updated = false;

        /*
        burgerModelBD.getName(): Obtiene el nombre actual de la hamburguesa desde el objeto burgerModelBD.
        equals(nombreNuevo): Compara el nombre actual con el nuevo nombre proporcionado para ver si son iguales.
        ! (Negación lógica): Invierte el resultado de la comparación. Si los nombres son iguales, equals() devuelve true,
        pero con ! se convierte en false. Si los nombres son diferentes, equals() devuelve false, y con ! se convierte en true.*/
        if (!burgerModelBD.getName().equals(nombreNuevo)) {
            burgerModelBD.setName(nombreNuevo);
            updated = true;
        }
        if (!burgerModelBD.getDescription().equals(descripcion)) {
            burgerModelBD.setDescription(descripcion);
            updated = true;
        }

        /*
            burgerModelBD.getPrice(): Obtiene el precio actual de la hamburguesa desde el objeto burgerModelBD.
            price: Es el precio nuevo que se desea establecer para la hamburguesa.
            compareTo(price): Es un método de la clase BigDecimal (que es el tipo de price y burgerModelBD.getPrice()) que compara
            el valor del objeto BigDecimal (el precio actual de la hamburguesa) con otro objeto BigDecimal (el nuevo precio).
            Devuelve 0 si ambos valores son iguales.
            Devuelve un número negativo si el precio actual es menor que el nuevo precio.
            Devuelve un número positivo si el precio actual es mayor que el nuevo precio.
            != 0: Verifica si el valor de compareTo no es igual a cero. Es decir, verifica si el precio actual de la hamburguesa
            es diferente al nuevo precio.*/
        if (burgerModelBD.getPrice().compareTo(price) != 0) {
            burgerModelBD.setPrice(price);
            updated = true;
        }

        if (updated) {
            burgerRepository.save(burgerModelBD);
            return "Hamburguesa modificada exitosamente";
        }

        return "No se realizaron cambios en la hamburguesa";
    }
}
