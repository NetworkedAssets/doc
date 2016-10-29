package com.networkedassets.autodoc.configuration;

import com.atlassian.activeobjects.external.ActiveObjects;
import com.atlassian.confluence.user.AuthenticatedUserThreadLocal;
import com.google.common.collect.ImmutableMap;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.networkedassets.autodoc.TransformerClient;
import com.networkedassets.util.functional.Optionals;
import net.java.ao.Query;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;

@Path("token")
@Consumes("application/json")
public class BundleAccessTokenService {

    private TransformerClient transformerClient;
    private ActiveObjects ao;

    public BundleAccessTokenService(ActiveObjects ao, DocSettingsService docSettingsService) {
        this.ao = ao;
        this.transformerClient = new TransformerClient(docSettingsService, this);
    }

    public String getForUserKey(String userKey) throws TokenNotFoundException {
        BundleAccessToken accessToken = null;

        try {
            accessToken = ao.executeInTransaction(() ->
                    ao.find(BundleAccessToken.class, Query.select().where("USER_KEY = ?", userKey))[0]
            );
        } catch (ArrayIndexOutOfBoundsException e) {
            throw new TokenNotFoundException();
        }

        return accessToken.getAccessToken();
    }

    public void setForUserKey(String userKey, String token) {
        ao.executeInTransaction(() -> {
            BundleAccessToken accessToken =
                    Optionals.fromArrayOfOne(
                            ao.find(BundleAccessToken.class, Query.select().where("USER_KEY = ?", userKey))
                    ).orElse(
                            ao.create(BundleAccessToken.class, ImmutableMap.of("USER_KEY", userKey))
                    );
            accessToken.setAccessToken(token);
            accessToken.save();
            return accessToken;
        });
    }

    public void setForCurrentUser(String token) {
        setForUserKey(AuthenticatedUserThreadLocal.get().getKey().getStringValue(), token);
    }

    @PUT
    public void saveTokenForTransformerUser(Credentials credentials) throws UnirestException {
        String token = transformerClient.getToken(credentials);
        setForCurrentUser(token);
    }

    @GET
    @Path("ask")
    public boolean doesCurrentUserHaveToken() {
        String userKey = AuthenticatedUserThreadLocal.get().getKey().getStringValue();
        return ao.executeInTransaction(() ->
                ao.find(BundleAccessToken.class, Query.select().where("USER_KEY = ?", userKey)).length == 1);
    }

    public static class Credentials {
        public String username;
        public String password;
    }
}
