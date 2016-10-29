package com.networkedassets.autodoc.documentation;

import com.mashape.unirest.http.exceptions.UnirestException;
import com.networkedassets.autodoc.TransformerClient;
import com.networkedassets.autodoc.configuration.BundleAccessTokenService;
import com.networkedassets.autodoc.configuration.DocSettingsService;
import com.networkedassets.util.functional.Throwing;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class DocumentationRepository {
    private TransformerClient tc;

    public DocumentationRepository(
            DocSettingsService docSettingsService,
            BundleAccessTokenService bundleAccessTokenService
    ) {
        this.tc = new TransformerClient(docSettingsService, bundleAccessTokenService);
    }

    public Optional<Documentation> findDocumentation(
            String macroOwnerKey,
            int bundleId,
            String documentationType
    ) {
        try {
            return tc.getBundleById(macroOwnerKey, bundleId).flatMap(Throwing.functionRethrowAsRuntimeException(
                    bundle -> tc.getDocumentation(macroOwnerKey, bundle, documentationType)));
        } catch (UnirestException e) {
            throw new RuntimeException(e);
        }
    }

    public Optional<DocumentationPiece> findDocumentationPiece(
            String macroOwnerKey,
            int bundleId,
            String docType,
            String docPieceName
    ) {
        return findDocumentation(macroOwnerKey, bundleId, docType)
                .flatMap(d -> findDocumentationPieceInDocumentation(d, docPieceName));
    }

    public Optional<DocumentationPiece> findDocumentationPieceInDocumentation(Documentation doc, String docPieceName) {
        return doc.getDocumentationPieces().stream().filter(dp -> docPieceName.equals(dp.getPieceName())).findAny();
    }

    public List<DocumentationPiece> findDocumentationPieceWithQuery(
            String macroOwnerKey,
            int bundleId,
            String doctype,
            String query
    ) {
        Optional<Documentation> documentation = findDocumentation(macroOwnerKey, bundleId, doctype);
        return documentation.map(doc ->
            doc.getDocumentationPieces().parallelStream()
                    .filter(dp -> Pattern.compile(query).matcher(dp.getContent()).find())
                    .collect(Collectors.toList())
        ).orElse(Collections.emptyList());
    }
}
