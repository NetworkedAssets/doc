package com.networkedassets.autodoc.documentation.transformer2;

import java.util.List;

public class DocItemSet {
    public static final String UML_TYPE = "CLASS_DIAGRAM";
    public static final String JAVADOC_TYPE = "JSON";

    private String type;
    private List<DocItem> docItems;
    private int id;

    public DocItemSet(String type, List<DocItem> docItems, int id) {
        this.type = type;
        this.docItems = docItems;
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public DocItemSet setType(String type) {
        this.type = type;
        return this;
    }

    public List<DocItem> getDocItems() {
        return docItems;
    }

    public DocItemSet setDocItems(List<DocItem> docItems) {
        this.docItems = docItems;
        return this;
    }

    public int getId() {
        return id;
    }

    public DocItemSet setId(int id) {
        this.id = id;
        return this;
    }
}
