package com.bigburger.bigburger.models;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "burger_elemento")
public class BurgerElementoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "burger_id", nullable = false)
    private BurgerModel burgerModel;

    @ManyToOne
    @JoinColumn(name = "elemento_id", nullable = false)
    private ElementoModel elementoModel;

    public BurgerElementoModel(BurgerModel burgerModel, ElementoModel elementoModel) {
        this.burgerModel = burgerModel;
        this.elementoModel = elementoModel;
    }
}
