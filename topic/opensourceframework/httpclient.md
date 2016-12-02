---
layout: topic
module: 开源框架
title:  HttpClient
date:   2016-12-01
---

#### 示例代码

```java
public class HttpClientTest {

    public static void main(String[] args) throws IOException {
        PoolingHttpClientConnectionManager connectionManager = new PoolingHttpClientConnectionManager();
        connectionManager.setMaxTotal(200);
        connectionManager.setDefaultMaxPerRoute(20);

        RequestConfig requestConfig = RequestConfig.custom()
                .setSocketTimeout(5000)
                .setConnectTimeout(5000)
                .setConnectionRequestTimeout(5000)
                .build();

        CloseableHttpClient httpClient = HttpClients.custom()
                .setConnectionManager(connectionManager)
                .setDefaultRequestConfig(requestConfig)
                .setRetryHandler(new DefaultHttpRequestRetryHandler(3))
                .build();

        HttpGet httpGet = new HttpGet("http://www.txazo.com/");

        try {
            String result = httpClient.execute(httpGet, new ResponseHandler<String>() {

                @Override
                public String handleResponse(HttpResponse response) throws IOException {
                    int status = response.getStatusLine().getStatusCode();
                    if (status == HttpStatus.SC_OK) {
                        return EntityUtils.toString(response.getEntity());
                    }
                    throw new ClientProtocolException("Unexpected response status: " + status);
                }

            });
            System.out.println(result);
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            httpClient.close();
        }
    }

    public static class DefaultHttpRequestRetryHandler implements HttpRequestRetryHandler {

        private final int retryCount;

        public DefaultHttpRequestRetryHandler(int retryCount) {
            this.retryCount = retryCount;
        }

        @Override
        public boolean retryRequest(IOException exception, int executionCount, HttpContext context) {
            if (executionCount >= retryCount) {
                return false;
            }
            if (exception instanceof InterruptedIOException) {
                return false;
            }
            if (exception instanceof UnknownHostException) {
                return false;
            }
            if (exception instanceof ConnectTimeoutException) {
                return false;
            }
            if (exception instanceof SSLException) {
                return false;
            }
            HttpClientContext clientContext = HttpClientContext.adapt(context);
            HttpRequest request = clientContext.getRequest();
            return !(request instanceof HttpEntityEnclosingRequest);
        }

    }

}
```

#### 源码解读

#### 情景一: 高并发实时请求

***情景描述***: 线上实时请求Http接口

***要求***: 高并发，实时响应，限流

***技术方案***: HttpClient + 线程池

#### 情景二: 百万量级请求

***情景描述***: 百万量级的Http请求任务

***要求***: 保证执行效率和成功率

***技术方案***: HttpClient + 阻塞队列 + 多线程

\[参考\]:

* [Apache HttpComponents](http://hc.apache.org/)
