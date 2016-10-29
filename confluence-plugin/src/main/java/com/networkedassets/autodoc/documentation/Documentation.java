package com.networkedassets.autodoc.documentation;

import java.util.List;

public class Documentation {
    private String documentationType;
    private String bundle;
    private List<DocumentationPiece> documentationPieces;

    public String getDocumentationType() {
        return documentationType;
    }

    public Documentation setDocumentationType(String documentationType) {
        this.documentationType = documentationType;
        return this;
    }


    public List<DocumentationPiece> getDocumentationPieces() {
        return documentationPieces;
    }

    public Documentation setDocumentationPieces(List<DocumentationPiece> documentationPieces) {
        this.documentationPieces = documentationPieces;
        return this;
    }

    public String getBundle() {
        return bundle;
    }

    public Documentation setBundle(String bundle) {
        this.bundle = bundle;
        return this;
    }
}
