package com.bigburger.bigburger.repository;

import com.bigburger.bigburger.models.PapasModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IPapasRepository extends JpaRepository<PapasModel,Long> {

    Optional<PapasModel> findPapasByName(String name);
    void deletePapasByName(String name);

}
