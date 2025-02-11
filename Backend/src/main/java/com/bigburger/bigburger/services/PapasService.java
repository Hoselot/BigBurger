package com.bigburger.bigburger.services;

import com.bigburger.bigburger.dto.PapasDto;
import com.bigburger.bigburger.exeptions.BurgerNotFoundException;
import com.bigburger.bigburger.exeptions.ElementoNotFoundException;
import com.bigburger.bigburger.models.*;
import com.bigburger.bigburger.repository.IElementoRepository;
import com.bigburger.bigburger.repository.IPapasElementoRepository;
import com.bigburger.bigburger.repository.IPapasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PapasService {

    @Autowired
    private IPapasRepository papasRepository;
    @Autowired
    private IElementoRepository elementoRepository;
    @Autowired
    private IPapasElementoRepository papasElementoRepository;



    public List<PapasModel> listarPapasADMIN(){
        return papasRepository.findAll();
    }

    public List<PapasElementoModel> eliminarElementoPapas(Long idPapas, Long idElemento){
        List<PapasElementoModel> papasElementoList = papasElementoRepository.findAllByPapasModelIdAndElementoModelId(idPapas, idElemento);

        if (papasElementoList.isEmpty()) {
            return null; // Si no hay elementos, no se hace nada y se retorna null
        }

        // Obtener el último elemento de la lista
        PapasElementoModel lastElement = papasElementoList.get(papasElementoList.size() - 1);
        lastElement.getPapasModel().setCosto(lastElement.getPapasModel().getCosto().subtract(lastElement.getElementoModel().getPrice()));
        lastElement.getPapasModel().setPrice(lastElement.getPapasModel().getCosto());
        lastElement.getPapasModel().setPrice(lastElement.getPapasModel().getPrice().add(lastElement.getPapasModel().getGanancia()));
        papasRepository.save(lastElement.getPapasModel());
        // Eliminar el último elemento
        papasElementoRepository.delete(lastElement);
        return papasElementoRepository.findAllByPapasModelIdAndElementoModelId(idPapas, idElemento);
    }

    public PapasElementoModel agregarElementoPapas(Long idPapas, Long idElemento){
        ElementoModel elementoModel = elementoRepository.findById(idElemento).orElseThrow(() -> new ElementoNotFoundException("Elemento no encontrado"));
        PapasModel papasModel = papasRepository.findById(idPapas).orElseThrow((() -> new BurgerNotFoundException("Papas no encontradas")));
        PapasElementoModel papasElementoModel = new PapasElementoModel(papasModel,elementoModel);
        papasModel.setCosto(papasModel.getCosto().add(elementoModel.getPrice()));
        papasModel.setPrice(papasModel.getCosto());
        papasModel.setPrice(papasModel.getPrice().add(papasModel.getGanancia()));
        papasRepository.save(papasModel);
        return papasElementoRepository.save(papasElementoModel);
    }

    public List<PapasElementoModel> listarElementosPapas(Long idPapas) {
        return papasElementoRepository.findAllByPapasModelId(idPapas);
    }

    public List<PapasDto> listarPapas() {
        return papasRepository.findAll().stream()
                .map(papas -> new PapasDto(
                        papas.getId(),
                        papas.getName(),
                        papas.getPrice()
                ))
                .collect(Collectors.toList());
    }

    public PapasModel crearPapas(PapasModel papasModel){
        Optional<PapasModel> papasExistentes = papasRepository.findPapasByName(papasModel.getName());

        if (papasExistentes.isPresent()) {
            throw new IllegalArgumentException("Ya existen unas papas con el nombre: " + papasModel.getName());
        }

        papasModel.setGanancia(BigDecimal.valueOf(0));
        papasModel.setPrice(BigDecimal.valueOf(0));
        papasModel.setCosto(BigDecimal.valueOf(0));
        papasModel.setPrivada(false);
        return papasRepository.save(papasModel);
    }

    public String eliminarPapas(Long id){
        papasRepository.deleteById(id);
        return "Papas eliminadas exitosamente";
    }

    public PapasModel actualizarPapas(Long idPapas, PapasModel papasModelBody) {
        PapasModel papasModel = papasRepository.findById(idPapas).orElseThrow((() -> new BurgerNotFoundException("Papas no encontradas")));
        if(!papasModelBody.getName().equals(papasModel.getName())){
            papasModel.setName(papasModelBody.getName());
        }
        if (!papasModel.getDescription().equals(papasModelBody.getDescription())){
            papasModel.setDescription(papasModelBody.getDescription());
        }
        return papasRepository.save(papasModel);
    }

    public PapasModel asignarGananciaPapas(Long idPapas, BigDecimal ganancia){
        PapasModel papasModel = papasRepository.findById(idPapas).orElseThrow((() -> new BurgerNotFoundException("Papas no encontradas")));
        papasModel.setGanancia(ganancia);
        papasModel.setPrice(papasModel.getCosto());
        papasModel.setPrice(papasModel.getPrice().add(ganancia));
        return papasRepository.save(papasModel);
    }
}
