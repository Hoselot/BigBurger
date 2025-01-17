package com.bigburger.bigburger.services;

import com.bigburger.bigburger.exeptions.BurgerNotFoundException;
import com.bigburger.bigburger.exeptions.ElementoNotFoundException;
import com.bigburger.bigburger.models.BurgerElementoModel;
import com.bigburger.bigburger.models.BurgerModel;
import com.bigburger.bigburger.models.ElementoModel;
import com.bigburger.bigburger.repository.IBurgerElementoRepository;
import com.bigburger.bigburger.repository.IBurgerRepository;
import com.bigburger.bigburger.repository.IElementoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ElementoService {

    @Autowired
    private IElementoRepository elementoRepository;
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
        for(BurgerElementoModel burgerElementoModel:elementoBurgers){
           BurgerModel burgerModel = burgerRepository.findById(burgerElementoModel.getBurgerModel().getId()).orElseThrow(() -> new BurgerNotFoundException("Hamburguesa no encontrada"));
           burgerModel.setCosto(burgerModel.getCosto().subtract(burgerElementoModel.getElementoModel().getPrice()));
           burgerRepository.save(burgerModel);
        }
        burgerElementoRepository.deleteByElementoModelId(id);
        elementoRepository.deleteById(id);
    }

    public List<ElementoModel> listarElementos(){
        return elementoRepository.findAll();
    }

}
