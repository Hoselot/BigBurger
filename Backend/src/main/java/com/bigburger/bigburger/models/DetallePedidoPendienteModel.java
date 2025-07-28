package com.bigburger.bigburger.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "detalles_pedido_pend")
public class DetallePedidoPendienteModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    @JsonBackReference
    private PedidoPendienteModel pedido;


    private String nombreBebida;

    private String nombrePapas;

    @Column(nullable = false)
    private String nombreHamburguesa;

    @Column(nullable = false)
    private int cantidad;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precioTotal;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal gananciaUnitaria;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal gananciaTotal;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal costo;
}
