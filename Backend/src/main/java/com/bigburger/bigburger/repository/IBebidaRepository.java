package com.bigburger.bigburger.repository;

import com.bigburger.bigburger.models.BebidaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IBebidaRepository extends JpaRepository<BebidaModel,Long> {

    Optional<BebidaModel> findBebidaByName(String name);
    void deleteBebidaByName(String name);

}
