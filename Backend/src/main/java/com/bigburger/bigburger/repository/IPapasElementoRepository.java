package com.bigburger.bigburger.repository;

import com.bigburger.bigburger.models.BurgerElementoModel;
import com.bigburger.bigburger.models.PapasElementoModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IPapasElementoRepository extends JpaRepository<PapasElementoModel,Long> {
    void deleteByElementoModelId(Long id);
    List<PapasElementoModel> findAllByElementoModelId(Long id);
    List<PapasElementoModel> findAllByPapasModelId(Long id);
    List<PapasElementoModel> findAllByPapasModelIdAndElementoModelId(Long idPapas,Long idElemento);
}
