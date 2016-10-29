package com.networkedassets.autodoc.documentation.transformer2;

public class Bundle {
    private int id;
    private String name;

    public Bundle(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public Bundle setId(int id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return name;
    }

    public Bundle setName(String name) {
        this.name = name;
        return this;
    }
}
