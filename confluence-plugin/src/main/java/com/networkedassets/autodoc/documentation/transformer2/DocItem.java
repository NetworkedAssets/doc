package com.networkedassets.autodoc.documentation.transformer2;

public class DocItem {
    private int id;

    public DocItem(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public DocItem setId(int id) {
        this.id = id;
        return this;
    }
}
