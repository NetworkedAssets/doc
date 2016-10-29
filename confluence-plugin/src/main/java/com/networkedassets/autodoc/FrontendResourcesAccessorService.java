package com.networkedassets.autodoc;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Paths;

@Path("frontend")
public class FrontendResourcesAccessorService {

    @GET
    @Path("{path:.*}")
    public Response getResource(@Context final HttpServletRequest req) {
        StreamingOutput so = new StreamingOutput() {
            @Override
            public void write(OutputStream output) throws IOException, WebApplicationException {
                InputStream res = this.getClass().getClassLoader().getResourceAsStream(req.getPathInfo());
                IOUtils.copy(res, output);
                output.flush();
            }
        };

        return Response.ok(so).header("Content-Type", inferContentType(req.getPathInfo())).build();
    }

    private String inferContentType(String path) {
        try {
            String type = Files.probeContentType(Paths.get(path));
            if (type == null) {
                String extension = FilenameUtils.getExtension(path);
                switch (extension) {
                    case "js":
                        return "application/javascript";
                    case "css":
                        return "text/css";
                    case "ico":
                        return "image/x-icon";
                    case "json":
                        return "application/json";
                    case "png":
                        return "image/png";
                    case "gif":
                        return "image/gif";
                    case "jpg":
                    case "jpeg":
                        return "image/jpeg";
                }
            }
            return type;
        } catch (IOException e) {
            return "text/plain";
        }
    }
}
