package com.networkedassets.autodoc.configuration;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.networkedassets.autodoc.TransformerClient;
import com.networkedassets.autodoc.documentation.transformer2.Bundle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;
import java.text.SimpleDateFormat;
import java.util.List;

@Path("/configuration/")
public class ConfigurationService {

    private static final Logger log = LoggerFactory.getLogger(ConfigurationService.class);
    private static ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private final DocSettingsService docSettingsService;
    private final TransformerClient transformerClient;

    public ConfigurationService(DocSettingsService docSettingsService, BundleAccessTokenService bundleAccessTokenService) {
        this.docSettingsService = docSettingsService;
        transformerClient = new TransformerClient(docSettingsService, bundleAccessTokenService);

        OBJECT_MAPPER.setDateFormat(new SimpleDateFormat("yyyy-MM-dd"));
        OBJECT_MAPPER.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    @Path("transformerUrl")
    @GET
    public String getTransformerUrl() {
        return docSettingsService.getTransformerUrl();
    }

    @Path("transformerUrl")
    @POST
    public void setTransformerUrl(String transformerUrl) {
        docSettingsService.setTransformerUrl(transformerUrl);
    }

    @Path("bundles")
    @GET
    public Response getAllBundles(@HeaderParam("X-Macro-Owner") String macroOwnerKey) throws JsonProcessingException, UnirestException {
        List<Bundle> res = transformerClient.getAllBundles(macroOwnerKey);
        return Response.ok(OBJECT_MAPPER.writeValueAsString(res)).build();
    }

}
