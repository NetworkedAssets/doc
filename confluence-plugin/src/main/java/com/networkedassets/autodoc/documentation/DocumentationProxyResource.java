package com.networkedassets.autodoc.documentation;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.mashape.unirest.request.GetRequest;
import com.networkedassets.autodoc.configuration.BundleAccessTokenService;
import com.networkedassets.autodoc.configuration.DocSettingsService;
import com.networkedassets.autodoc.configuration.TokenNotFoundException;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/transformer/")
@Produces({MediaType.APPLICATION_JSON})
public class DocumentationProxyResource {

    private BundleAccessTokenService bundleAccessTokenService;

    private DocSettingsService docSettingsService;

    public DocumentationProxyResource(BundleAccessTokenService bundleAccessTokenService, DocSettingsService docSettingsService) {
        this.bundleAccessTokenService = bundleAccessTokenService;
        this.docSettingsService = docSettingsService;
    }

    @GET
    @Path("{path:.*}")
    public Response proxy(@HeaderParam("X-Macro-Owner") String macroOwner, @PathParam("path") String path, @Context HttpServletRequest request) {
        try {
            String url = docSettingsService.getTransformerUrl() + "/rest/" + path + ((request.getQueryString() != null) ? "?" + request.getQueryString() : "");

            GetRequest unirestRequest = Unirest.get(url)
                    .header("Authorization", "Bearer " + bundleAccessTokenService.getForUserKey(macroOwner));
            HttpResponse<String> response = unirestRequest
                    .asString();

            return Response
                    .status(response.getStatus())
                    .entity(response.getBody())
                    .header("Content-Type", response.getHeaders().get("Content-Type"))
                    .build();
        } catch (UnirestException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Unirest exception").build();
        } catch (TokenNotFoundException e) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
    }
}
