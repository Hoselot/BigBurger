package com.bigburger.bigburger.services;

import com.bigburger.bigburger.models.ElementoModel;
import com.bigburger.bigburger.repository.IBurgerElementoRepository;
import com.bigburger.bigburger.repository.IElementoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ElementoService {

    @Autowired
    private IElementoRepository elementoRepository;
    @Autowired
    private IBurgerElementoRepository burgerElementoRepository;

    public ElementoModel crearElemento(ElementoModel elementoModel){
        return elementoRepository.save(elementoModel);
    }

    public void eliminarElemento(Long id){
        burgerElementoRepository.deleteByElementoModelId(id);
        elementoRepository.deleteById(id);
    }

    public List<ElementoModel> listarElementos(){
        return elementoRepository.findAll();
    }

}
