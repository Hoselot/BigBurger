package com.bigburger.bigburger.repository;

import com.bigburger.bigburger.models.BurgerModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IBurgerRepository extends JpaRepository<BurgerModel,Long> {

    Optional<BurgerModel> findBurgerByName(String name);
    void deleteBurgerByName(String name);

}
