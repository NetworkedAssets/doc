package com.networkedassets.autodoc;

import com.fasterxml.jackson.databind.JsonNode;
import com.mashape.unirest.http.ObjectMapper;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.networkedassets.autodoc.configuration.BundleAccessTokenService;
import com.networkedassets.autodoc.configuration.DocSettingsService;
import com.networkedassets.autodoc.configuration.TokenNotFoundException;
import com.networkedassets.autodoc.documentation.Documentation;
import com.networkedassets.autodoc.documentation.DocumentationPiece;
import com.networkedassets.autodoc.documentation.transformer2.Bundle;
import com.networkedassets.autodoc.documentation.transformer2.DocItem;
import com.networkedassets.autodoc.documentation.transformer2.DocItemSet;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.conn.ssl.AllowAllHostnameVerifier;
import org.apache.http.conn.ssl.SSLContextBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.networkedassets.autodoc.documentation.transformer2.DocItemSet.JAVADOC_TYPE;
import static com.networkedassets.autodoc.documentation.transformer2.DocItemSet.UML_TYPE;

public class TransformerClient {
    private static final String BUNDLES = "/rest/bundles";
    private static final int CONNECTION_TIMEOUT = 90000;
    private static final int SOCKET_TIMEOUT = 90000;
    private static final com.fasterxml.jackson.databind.ObjectMapper OBJECT_MAPPER = new com.fasterxml.jackson.databind.ObjectMapper();

    public static final Logger log = LoggerFactory.getLogger(TransformerClient.class);

    private DocSettingsService docSettingsService;
    private BundleAccessTokenService bundleAccessTokenService;

    public TransformerClient(DocSettingsService docSettingsService, BundleAccessTokenService bundleAccessTokenService) {
        this.docSettingsService = docSettingsService;
        this.bundleAccessTokenService = bundleAccessTokenService;
        log.debug("Transformer server constructing");
        Unirest.setObjectMapper(getConfiguredObjectMapper());
        Unirest.setHttpClient(getConfiguredHttpClient());
    }

    public String getUrl() {
        return docSettingsService.getTransformerUrl();
    }

    private static CloseableHttpClient getConfiguredHttpClient() {
        try {

            return HttpClients.custom()
                    .setDefaultRequestConfig(RequestConfig.custom().setSocketTimeout(SOCKET_TIMEOUT)
                            .setConnectTimeout(CONNECTION_TIMEOUT).build())
                    .setHostnameVerifier(new AllowAllHostnameVerifier())
                    .setSslcontext(new SSLContextBuilder().loadTrustMaterial(null, (_1, _2) -> true).build()).build();
        } catch (NoSuchAlgorithmException | KeyManagementException | KeyStoreException e) {
            throw new RuntimeException(e);
        }
    }

    private static ObjectMapper getConfiguredObjectMapper() {
        return new ObjectMapper() {
            private com.fasterxml.jackson.databind.ObjectMapper jacksonObjectMapper = new com.fasterxml.jackson.databind.ObjectMapper();

            @Override
            public <T> T readValue(String value, Class<T> valueType) {
                try {
                    return jacksonObjectMapper.readValue(value, valueType);
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }

            @Override
            public String writeValue(Object value) {
                try {
                    return jacksonObjectMapper.writeValueAsString(value);
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
        };
    }

    public Optional<Bundle> getBundleById(String macroOwnerKey, int bundleId) throws UnirestException {
        String token = null;
        try {
            token = bundleAccessTokenService.getForUserKey(macroOwnerKey);
        } catch (TokenNotFoundException e) {
            return Optional.empty();
        }
        JSONArray array = Unirest
                .get(getUrl() + BUNDLES)
                .header("Authorization", "Bearer " + token)
                .asJson()
                .getBody()
                .getArray();
        for (int i = 0; i < array.length(); i++) {
            JSONObject jsonObject = array.getJSONObject(i);
            if (jsonObject.getInt("id") == bundleId)
                return Optional.of(new Bundle(jsonObject.getInt("id"), jsonObject.getString("name")));
        }
        return Optional.empty();
    }

    public List<Bundle> getAllBundles(String macroOwnerKey) throws UnirestException {
        List<Bundle> res = new ArrayList<>();
        String token = null;
        try {
            token = bundleAccessTokenService.getForUserKey(macroOwnerKey);
        } catch (TokenNotFoundException e) {
            throw new UnirestException(e);
        }
        JSONArray array = Unirest
                .get(getUrl() + BUNDLES)
                .header("Authorization", "Bearer " + token)
                .asJson()
                .getBody()
                .getArray();
        for (int i = 0; i < array.length(); i++) {
            JSONObject jsonObject = array.getJSONObject(i);
            res.add(new Bundle(jsonObject.getInt("id"), jsonObject.getString("name")));
        }
        return res;
    }

    public Optional<Documentation> getDocumentation(String macroOwnerKey, Bundle bundle, String documentationType) throws UnirestException {
        final String token;
        try {
            token = bundleAccessTokenService.getForUserKey(macroOwnerKey);
        } catch (TokenNotFoundException e) {
            return Optional.empty();
        }
        List<DocItemSet> docItemSetList = getDocItemSets(token, bundle);
        String type = documentationType.equals("uml") ? UML_TYPE : JAVADOC_TYPE;
        return docItemSetList.stream().filter(docItemSet -> docItemSet.getType().equals(type)).findAny()
                .flatMap(docItemSet -> {
                    try {
                        JSONObject docItemSetJson = Unirest
                                .get(getUrl() + "/rest/docitemsets/{id}")
                                .routeParam("id", String.valueOf(docItemSet.getId()))
                                .header("Authorization", "Bearer " + token)
                                .asJson()
                                .getBody()
                                .getObject();
                        JSONArray docItems = docItemSetJson.getJSONArray("docItems");
                        JSONObject docItem = docItems.getJSONObject(0);
                        String content = docItem.getString("content");
                        JsonNode jsonNode = OBJECT_MAPPER.readTree(content);
                        JsonNode pieces = jsonNode.get("pieces");
                        Documentation doc = new Documentation();
                        doc.setDocumentationType(documentationType);
                        doc.setBundle(bundle.getName());
                        List<DocumentationPiece> docPieces = new ArrayList<>();
                        for (JsonNode piece: pieces) {
                            DocumentationPiece documentationPiece = new DocumentationPiece();
                            documentationPiece.setDocumentation(doc);
                            documentationPiece.setPieceName(piece.get("pieceName").asText());
                            documentationPiece.setPieceType(piece.get("pieceType").asText());
                            documentationPiece.setContent(piece.get("content").asText());
                            docPieces.add(documentationPiece);
                        }
                        doc.setDocumentationPieces(docPieces);
                        return Optional.of(doc);
                    } catch (UnirestException | IOException e) {
                        e.printStackTrace();
                        return Optional.empty();
                    }
                });
    }

    private List<DocItemSet> getDocItemSets(String token, Bundle bundle) throws UnirestException {
        JSONObject bundleJson = Unirest
                .get(getUrl() + "/rest/bundles/{id}")
                .routeParam("id", Integer.toString(bundle.getId()))
                .header("Authorization", "Bearer " + token)
                .asJson()
                .getBody()
                .getObject();
        JSONArray sourceUnits = bundleJson.getJSONArray("sourceUnits");
        List<DocItemSet> res = new ArrayList<>();
        for (int i = 0; i < sourceUnits.length(); i++) {
            JSONArray docItemSets = sourceUnits.getJSONObject(i).getJSONArray("docItemSets");
            for (int j = 0; j < docItemSets.length(); j++) {
                JSONObject docItemSet = docItemSets.getJSONObject(j);
                List<DocItem> docItems = getDocItems(docItemSet);
                res.add(new DocItemSet(docItemSet.getString("type"), docItems, docItemSet.getInt("id")));
            }
        }
        return res;
    }

    private List<DocItem> getDocItems(JSONObject docItemSet) {
        ArrayList<DocItem> res = new ArrayList<>();
        JSONArray docItems = docItemSet.getJSONArray("docItems");
        for (int i = 0; i < docItems.length(); i++) {
            JSONObject docItem = docItems.getJSONObject(i);
            res.add(new DocItem(docItem.getInt("id")));
        }
        return res;
    }

    public String getToken(BundleAccessTokenService.Credentials credentials) throws UnirestException {
        return Unirest.put(getUrl() + "/rest/users/signIn")
                .header("Content-Type", "application/json")
                .body(credentials)
                .asJson()
                .getBody()
                .getObject()
                .getString("token");
    }
}
