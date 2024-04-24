package com.demo.learngraphql.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductModel implements java.io.Serializable {
    private Long id;
    private String name;
    private Float price;
    private String description;
}
