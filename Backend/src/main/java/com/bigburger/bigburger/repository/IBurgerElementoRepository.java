package com.bigburger.bigburger.repository;

import com.bigburger.bigburger.models.BurgerElementoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IBurgerElementoRepository extends JpaRepository<BurgerElementoModel,Long> {
    void deleteByElementoModelId(Long id);
    List<BurgerElementoModel> findAllByElementoModelId(Long id);
    List<BurgerElementoModel> findAllByBurgerModelId(Long id);
    List<BurgerElementoModel> findAllByBurgerModelIdAndElementoModelId(Long idBurger,Long idElemento);
}
