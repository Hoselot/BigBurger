package com.bigburger.bigburger.models;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "bebidas")
public class BebidaModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, precision = 10, scale = 2)  // Configuración de precisión y escala
    private BigDecimal price;

    @Column(nullable = false, precision = 10, scale = 2)  // Configuración de precisión y escala
    private BigDecimal ganancia;
    @Column(nullable = false, precision = 10, scale = 2)  // Configuración de precisión y escala
    private BigDecimal costo;
    @Column(nullable = false)
    private Boolean privada;

    @Column
    private String pictureUrl;
}
