package com.networkedassets.autodoc.configuration;

import net.java.ao.Entity;
import net.java.ao.Preload;
import net.java.ao.schema.Indexed;
import net.java.ao.schema.Unique;

@Preload
public interface BundleAccessToken extends Entity {
    @Indexed
    @Unique
    String getUserKey();
    @Indexed
    @Unique
    void setUserKey(String userKey);

    String getAccessToken();
    void setAccessToken(String token);
}
