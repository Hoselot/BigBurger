package com.bigburger.bigburger.repository;

import com.bigburger.bigburger.models.PedidoPendienteModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IPedidoPendienteRepository extends JpaRepository<PedidoPendienteModel,Long> {

    Optional<PedidoPendienteModel> findPedidoPendienteModelByExternalReference(String externalReference);
}
