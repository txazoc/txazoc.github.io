---
layout: topic
module: Java
title:  GZIP
date:   2016-12-10
---

Java GZIP压缩解压缩:

```java
public abstract class GZipUtils {

    private static final double zipRatio = 0.4;
    private static final double unzipRatio = 0.2;

    /**
     * gzip压缩
     */
    public static byte[] zip(byte[] data) throws IOException {
        GZIPOutputStream gzip = null;
        ByteArrayOutputStream baos = null;
        try {
            baos = new ByteArrayOutputStream((int) (data.length * zipRatio));
            gzip = new GZIPOutputStream(baos);
            gzip.write(data);
            gzip.flush();
            return baos.toByteArray();
        } finally {
            IOUtils.closeQuietly(gzip);
            IOUtils.closeQuietly(baos);
        }
    }

    /**
     * gzip解压
     */
    public static byte[] unzip(byte[] data) throws IOException {
        GZIPInputStream gzip = null;
        ByteArrayOutputStream baos = null;
        try {
            gzip = new GZIPInputStream(new ByteArrayInputStream(data));
            baos = new ByteArrayOutputStream((int) (data.length / unzipRatio));
            IOUtils.copy(gzip, baos);
            return baos.toByteArray();
        } finally {
            IOUtils.closeQuietly(baos);
            IOUtils.closeQuietly(gzip);
        }
    }

}
```
