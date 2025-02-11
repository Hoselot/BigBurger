package com.bigburger.bigburger.repository;


import com.bigburger.bigburger.models.DetallePedidoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IDetallePedidoRepository extends JpaRepository<DetallePedidoModel, Long> {
}
