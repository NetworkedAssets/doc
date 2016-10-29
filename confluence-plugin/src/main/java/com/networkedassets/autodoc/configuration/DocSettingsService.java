package com.networkedassets.autodoc.configuration;

import com.atlassian.core.util.ClassLoaderUtils;
import com.atlassian.sal.api.pluginsettings.PluginSettings;
import com.atlassian.sal.api.pluginsettings.PluginSettingsFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

@SuppressWarnings("WeakerAccess")
public class DocSettingsService {
    public static final String TRANSFORMER_URL = "com.networkedassets.autodoc.configuration.TRANSFORMER_URL";
    private final Logger log = LoggerFactory.getLogger(DocSettingsService.class);
    private final PluginSettings pluginSettings;

    public DocSettingsService(PluginSettingsFactory pluginSettingsFactory) {
        pluginSettings = pluginSettingsFactory.createGlobalSettings();
    }

    public String getTransformerUrl() {
        String url;
        url = (String) pluginSettings.get(TRANSFORMER_URL);
        if (url == null) {
            url = getTransformerUrlFromConfigFile();
            pluginSettings.put(TRANSFORMER_URL, url);
        }
        return url;
    }

    private String getTransformerUrlFromConfigFile() {
        InputStream properties = ClassLoaderUtils.getResourceAsStream("autodoc_confluence.properties", getClass());
        Properties props = new Properties();
        try {
            props.load(properties);
        } catch (IOException e) {
            log.error("Couldn't load the configuration file", e);
        }
        return props.getProperty("transformerUrl", "https://localhost:8080/transformer");
    }

    public void setTransformerUrl(String transformerUrl) {
        if (transformerUrl.endsWith("/")) {
            transformerUrl = transformerUrl.substring(0, transformerUrl.length() - 1);
        }
        pluginSettings.put(TRANSFORMER_URL, transformerUrl);
    }
}
