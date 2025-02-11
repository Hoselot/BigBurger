package com.bigburger.bigburger.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "pedidos")
public class PedidoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String cliente;

    @Column(nullable = false)
    private String contacto;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonManagedReference
    private List<DetallePedidoModel> detalles;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precioTotal;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal gananciaTotal;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal costoTotal;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal delivery;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = true)
    private Boolean transferencia;
}

