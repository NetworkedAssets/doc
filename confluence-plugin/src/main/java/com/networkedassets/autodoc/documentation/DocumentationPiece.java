package com.networkedassets.autodoc.documentation;

public class DocumentationPiece {
    private String pieceName;
    private String pieceType;
    private String content;
    private Documentation documentation;

    public String getPieceName() {
        return pieceName;
    }

    public void setPieceName(String name) {
        this.pieceName = name;
    }

    /**
     * Type of this documentation piece. Ex. for piece of javadoc this may be "class", "package"
     */
    public String getPieceType() {
        return pieceType;
    }

    public DocumentationPiece setPieceType(String pieceType) {
        this.pieceType = pieceType;
        return this;
    }

    public String getContent() {
        return content;
    }

    public DocumentationPiece setContent(String content) {
        this.content = content;
        return this;
    }

    public Documentation getDocumentation() {
        return documentation;
    }

    public DocumentationPiece setDocumentation(Documentation documentation) {
        this.documentation = documentation;
        return this;
    }
}
