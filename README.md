# ![](https://raw.githubusercontent.com/NetworkedAssets/autodoc/master/transformer/src/main/resources/images/transformer_logo.png "Transformer")<a href="http://www.networkedassets.com/"><img style="float: right;" src="http://www.networkedassets.com/wordpress/wp-content/uploads/2013/03/NA_logo_header.png" height="79"></a>

Java application used by [NetworkedAssets's](http://www.networkedassets.com/) [Documentation from Code Plugin](http://condoc.networkedassets.com/) for Atlassian Confluence.

## Installation

1. Make sure you've got **JDK 8** installed on your server, your **JAVA_HOME** and **PATH** environment variables are properly set.

```bash
# javac -version
# echo $JAVA_HOME
```

2. Prepare your favourite SSH and SFTP clients.
3. Copy the transformer jar and transformer helper scripts to your server via sftp. Suggested location is */opt/autodoc*.
4. Connect via **SSH** to your server.

```
ssh root@example
```

5. On your server machine run **transformer-start.<i></i>sh** contained in *scripts/server*.

```bash
# /opt/autodoc/transformer-start.sh
```

## Default Settings

By default properties look like this:

```
jetty.port=8050
jetty.address=http://localhost/
jetty.port=
```

You can change them by creating **transformer.properties** file next to the **transformer.jar** and add properties you want to override.