package com.bigburger.bigburger.repository;

import com.bigburger.bigburger.models.BebidaModel;
import com.bigburger.bigburger.models.ElementoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IElementoRepository extends JpaRepository<ElementoModel,Long> {

    Optional<ElementoModel> findElementoByName(String name);
}
