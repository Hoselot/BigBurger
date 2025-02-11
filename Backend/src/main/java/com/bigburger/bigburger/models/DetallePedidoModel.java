package com.bigburger.bigburger.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "detalle_pedido")
public class DetallePedidoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    @JsonBackReference
    private PedidoModel pedido;


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
