package com.bigburger.bigburger.models;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "papas_elemento")
public class PapasElementoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "papas_id", nullable = false)
    private PapasModel papasModel;

    @ManyToOne
    @JoinColumn(name = "elemento_id", nullable = false)
    private ElementoModel elementoModel;

    public PapasElementoModel(PapasModel papasModel, ElementoModel elementoModel) {
        this.papasModel = papasModel;
        this.elementoModel = elementoModel;
    }
}
