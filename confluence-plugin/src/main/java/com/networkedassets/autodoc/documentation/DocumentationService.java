package com.networkedassets.autodoc.documentation;

import com.atlassian.json.jsonorg.JSONException;
import com.atlassian.json.jsonorg.JSONObject;
import com.google.common.base.Joiner;
import com.google.common.base.Strings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Path("/documentation/")
@Produces({MediaType.APPLICATION_JSON})
public class DocumentationService {
    private final String ERROR_JSON = "{\"success\": false, \"message\": \"Could not find requested documentation!\"}";
    private DocumentationRepository docRepository;
    @SuppressWarnings("unused")
    private Logger log = LoggerFactory.getLogger(DocumentationService.class);

    public DocumentationService(DocumentationRepository docRepository) {
        this.docRepository = docRepository;
    }

    @Path("{bundle}/{doctype}")
    @GET
    public Response getDocumentationPiecesForProject(
            @HeaderParam("X-Macro-Owner") String macroOwnerKey,
            @PathParam("bundle") int bundle,
            @PathParam("doctype") String doctype
    ) throws UnsupportedEncodingException {
        String doctypeDec = URLDecoder.decode(doctype, "UTF-8");

        if ("uml".equalsIgnoreCase(doctypeDec))
            return getDocumentationPiece(macroOwnerKey, bundle, doctypeDec, "all");
        return docRepository.findDocumentation(macroOwnerKey, bundle, doctypeDec)
                .map(d -> Response.ok("{\"success\": true, \"documentationPieces\": [" +
                        d.getDocumentationPieces().stream()
                                .map(dp -> "{\"type\": \"" + dp.getPieceType() + "\","
                                        + "\"name\": \"" + dp.getPieceName() + "\"}")
                                .collect(Collectors.joining(",")) +
                        "]}"))
                .orElse(Response.status(404).entity(ERROR_JSON)).build();
    }

    @Path("{bundle}/{doctype}/{docPieceName}")
    @GET
    public Response getDocumentationPiece(
            @HeaderParam("X-Macro-Owner") String macroOwnerKey,
            @PathParam("bundle") int bundle,
            @PathParam("doctype") String docType,
            @PathParam("docPieceName") String docPieceName
    ) throws UnsupportedEncodingException {
        String doctypeDec = URLDecoder.decode(docType, "UTF-8");
        String docPieceNameDec = URLDecoder.decode(docPieceName, "UTF-8");

        Optional<DocumentationPiece> documentationPiece =
                docRepository.findDocumentationPiece(macroOwnerKey, bundle, doctypeDec, docPieceNameDec);

        return documentationPiece.map(this::makeDocPieceJson)
                .map(n -> Response.ok(n).build())
                .orElse(Response.status(404).entity(ERROR_JSON).build());
    }

    @Path("{bundle}/{doctype}/{docPieceName}/{attribute}")
    @GET
    public Response getDocumentationPieceByAttribute(
            @HeaderParam("X-Macro-Owner") String macroOwnerKey,
            @PathParam("bundle") int bundle,
            @PathParam("doctype") String docType,
            @PathParam("docPieceName") String docPieceName,
            @PathParam("attribute") String attribute
    ) throws UnsupportedEncodingException {
        String doctypeDec = URLDecoder.decode(docType, "UTF-8");
        String docPieceNameDec = URLDecoder.decode(docPieceName, "UTF-8");
        String attributeDec = URLDecoder.decode(attribute, "UTF-8");

        Optional<DocumentationPiece> documentationPiece =
                docRepository.findDocumentationPiece(macroOwnerKey, bundle, doctypeDec, docPieceNameDec);

        return documentationPiece.map(docPiece -> makeDocPieceJson(docPiece, attributeDec))
                .map(n -> Response.ok(n).build())
                .orElse(Response.status(404).entity(ERROR_JSON).build());
    }

    private String makeDocPieceJson(DocumentationPiece dp) {
        return dp.getContent();
    }

    private String makeDocPieceJson(DocumentationPiece dp, String attribute) {
        JSONObject jsonObject = new JSONObject(dp.getContent());
        try {
            return String.format("{\"%s\": \"%s\"}", attribute, jsonObject.getString(attribute));
        } catch (JSONException e) {
            return null;
        }
    }

    @Path("{bundle}/{doctype}/search")
    @GET
    public Response searchDocumentation(
            @HeaderParam("X-Macro-Owner") String macroOwnerKey,
            @PathParam("bundle") int bundle,
            @PathParam("doctype") String doctype,
            @QueryParam("q") String query
    ) throws UnsupportedEncodingException {

        if (Strings.isNullOrEmpty(query)) return Response.ok("{\"results\": []}").build();
        String queryDec = URLDecoder.decode(query, "UTF-8");
        String doctypeDec = URLDecoder.decode(doctype, "UTF-8");

        List<DocumentationPiece> searchResult =
                docRepository.findDocumentationPieceWithQuery(macroOwnerKey, bundle, doctypeDec, queryDec);

        final List<String> results = searchResult.stream()
                .map(dp -> "\"" + dp.getPieceName() + "\"")
                .collect(Collectors.toList());

        return Response.ok(String.format("{\"results\": [%s]}", Joiner.on(",").join(results))).build();
    }
}
