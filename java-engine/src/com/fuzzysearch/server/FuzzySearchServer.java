package com.fuzzysearch.server;

import com.fuzzysearch.benchmark.BenchmarkRunner;
import com.fuzzysearch.core.EditDistance;
import com.fuzzysearch.data.DictionaryLoader;
import com.fuzzysearch.tree.BKTree;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * Built-in Lightweight HTTP JSON REST API Server
 * Bridges the Java DSA engine with the Next.js full-stack web UI or external clients
 * Built with standard JDK com.sun.net.httpserver (zero external dependencies)
 * Course: Data Structures and Algorithms - 3 (25CS2103E)
 */
public class FuzzySearchServer {

    private final int port;
    private HttpServer server;
    private final Map<String, BKTree> dictionaryTrees = new HashMap<>();
    private final Map<String, List<String>> dictionaryWords = new HashMap<>();

    public FuzzySearchServer(int port) {
        this.port = port;
        initDictionaries();
    }

    private void initDictionaries() {
        dictionaryWords.put("tech-cs", DictionaryLoader.TECH_CS_WORDS);
        dictionaryWords.put("common-english", DictionaryLoader.COMMON_ENGLISH);
        dictionaryWords.put("medical", DictionaryLoader.MEDICAL_WORDS);
        dictionaryWords.put("multilingual", DictionaryLoader.MULTILINGUAL_WORDS);

        for (Map.Entry<String, List<String>> entry : dictionaryWords.entrySet()) {
            dictionaryTrees.put(entry.getKey(), new BKTree(entry.getValue()));
        }
    }

    public void start() throws IOException {
        server = HttpServer.create(new InetSocketAddress(port), 0);

        server.createContext("/api/search", new SearchHandler());
        server.createContext("/api/matrix", new MatrixHandler());
        server.createContext("/api/benchmark", new BenchmarkHandler());
        server.createContext("/api/status", new StatusHandler());

        server.setExecutor(java.util.concurrent.Executors.newCachedThreadPool());
        server.start();
        System.out.println(">>> Java Fuzzy Search REST API Server running at http://localhost:" + port);
    }

    public void stop() {
        if (server != null) {
            server.stop(0);
        }
    }

    private static Map<String, String> parseQueryParams(String query) {
        Map<String, String> map = new HashMap<>();
        if (query == null || query.isEmpty()) return map;

        String[] pairs = query.split("&");
        for (String pair : pairs) {
            int idx = pair.indexOf("=");
            if (idx > 0) {
                try {
                    String key = URLDecoder.decode(pair.substring(0, idx), StandardCharsets.UTF_8.name());
                    String value = URLDecoder.decode(pair.substring(idx + 1), StandardCharsets.UTF_8.name());
                    map.put(key, value);
                } catch (Exception ignored) {}
            }
        }
        return map;
    }

    private static void sendJsonResponse(HttpExchange exchange, int statusCode, String json) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");

        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private class SearchHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            Map<String, String> params = parseQueryParams(exchange.getRequestURI().getQuery());
            String query = params.getOrDefault("q", "algrithm");
            int tolerance = 2;
            try {
                if (params.containsKey("k")) tolerance = Integer.parseInt(params.get("k"));
            } catch (Exception ignored) {}

            String dictId = params.getOrDefault("dict", "tech-cs");
            BKTree tree = dictionaryTrees.getOrDefault(dictId, dictionaryTrees.get("tech-cs"));

            BKTree.SearchResult res = tree.search(query, tolerance);

            StringBuilder json = new StringBuilder("{");
            json.append("\"query\":\"").append(escape(query)).append("\",");
            json.append("\"tolerance\":").append(tolerance).append(",");
            json.append("\"searchTimeMs\":").append(String.format(Locale.US, "%.3f", res.getSearchTimeMs())).append(",");
            json.append("\"visitedNodesCount\":").append(res.getVisitedNodesCount()).append(",");
            json.append("\"prunedBranchesCount\":").append(res.getPrunedBranchesCount()).append(",");
            json.append("\"totalNodesInTree\":").append(res.getTotalNodesInTree()).append(",");
            json.append("\"prunedSavingsPercent\":").append(String.format(Locale.US, "%.1f", res.getPrunedPercentage())).append(",");
            json.append("\"matches\":[");

            List<BKTree.SearchMatch> matches = res.getMatches();
            for (int i = 0; i < matches.size(); i++) {
                BKTree.SearchMatch m = matches.get(i);
                json.append("{")
                    .append("\"word\":\"").append(escape(m.getWord())).append("\",")
                    .append("\"distance\":").append(m.getDistance()).append(",")
                    .append("\"similarityScore\":").append(String.format(Locale.US, "%.4f", m.getSimilarityScore())).append(",")
                    .append("\"depth\":").append(m.getDepth())
                    .append("}");
                if (i < matches.size() - 1) json.append(",");
            }
            json.append("]}");

            sendJsonResponse(exchange, 200, json.toString());
        }
    }

    private class MatrixHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            Map<String, String> params = parseQueryParams(exchange.getRequestURI().getQuery());
            String source = params.getOrDefault("s", "algrithm");
            String target = params.getOrDefault("t", "algorithm");

            EditDistance.DPMatrixResult res = EditDistance.computeDetailedMatrix(source, target);

            StringBuilder json = new StringBuilder("{");
            json.append("\"source\":\"").append(escape(source)).append("\",");
            json.append("\"target\":\"").append(escape(target)).append("\",");
            json.append("\"distance\":").append(res.getDistance()).append(",");
            json.append("\"similarityScore\":").append(String.format(Locale.US, "%.4f", res.getSimilarityScore())).append(",");
            json.append("\"matchCount\":").append(res.getMatchCount()).append(",");
            json.append("\"substitutionCount\":").append(res.getSubstitutionCount()).append(",");
            json.append("\"insertionCount\":").append(res.getInsertionCount()).append(",");
            json.append("\"deletionCount\":").append(res.getDeletionCount()).append(",");

            // Tokens
            json.append("\"sourceTokens\":[");
            for (int i = 0; i < res.getSourceTokens().size(); i++) {
                json.append("\"").append(escape(res.getSourceTokens().get(i))).append("\"");
                if (i < res.getSourceTokens().size() - 1) json.append(",");
            }
            json.append("],");

            json.append("\"targetTokens\":[");
            for (int i = 0; i < res.getTargetTokens().size(); i++) {
                json.append("\"").append(escape(res.getTargetTokens().get(i))).append("\"");
                if (i < res.getTargetTokens().size() - 1) json.append(",");
            }
            json.append("],");

            // 2D Matrix
            int[][] mat = res.getMatrix();
            json.append("\"matrix\":[");
            for (int i = 0; i < mat.length; i++) {
                json.append("[");
                for (int j = 0; j < mat[i].length; j++) {
                    json.append(mat[i][j]);
                    if (j < mat[i].length - 1) json.append(",");
                }
                json.append("]");
                if (i < mat.length - 1) json.append(",");
            }
            json.append("],");

            // Alignments
            json.append("\"alignment\":[");
            List<EditDistance.AlignmentStep> steps = res.getAlignment();
            for (int i = 0; i < steps.size(); i++) {
                EditDistance.AlignmentStep step = steps.get(i);
                json.append("{")
                    .append("\"operation\":\"").append(step.getOperation().name().toLowerCase()).append("\",")
                    .append("\"sourceChar\":\"").append(escape(step.getSourceChar())).append("\",")
                    .append("\"targetChar\":\"").append(escape(step.getTargetChar())).append("\",")
                    .append("\"cost\":").append(step.getCost())
                    .append("}");
                if (i < steps.size() - 1) json.append(",");
            }
            json.append("]}");

            sendJsonResponse(exchange, 200, json.toString());
        }
    }

    private class BenchmarkHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            Map<String, String> params = parseQueryParams(exchange.getRequestURI().getQuery());
            String query = params.getOrDefault("q", "algrithm");
            int tolerance = 2;
            try {
                if (params.containsKey("k")) tolerance = Integer.parseInt(params.get("k"));
            } catch (Exception ignored) {}

            List<BenchmarkRunner.BenchmarkRow> rows = BenchmarkRunner.runSuite(query, tolerance);

            StringBuilder json = new StringBuilder("{");
            json.append("\"query\":\"").append(escape(query)).append("\",");
            json.append("\"tolerance\":").append(tolerance).append(",");
            json.append("\"results\":[");
            for (int i = 0; i < rows.size(); i++) {
                BenchmarkRunner.BenchmarkRow r = rows.get(i);
                json.append("{")
                    .append("\"size\":").append(r.size).append(",")
                    .append("\"label\":\"").append(r.label).append("\",")
                    .append("\"naiveTimeMs\":").append(String.format(Locale.US, "%.2f", r.naiveTimeMs)).append(",")
                    .append("\"bkTreeTimeMs\":").append(String.format(Locale.US, "%.2f", r.bkTreeTimeMs)).append(",")
                    .append("\"naiveComparisons\":").append(r.naiveComparisons).append(",")
                    .append("\"bkTreeVisited\":").append(r.bkTreeVisited).append(",")
                    .append("\"comparisonsSavedPercent\":").append(String.format(Locale.US, "%.1f", r.comparisonsSavedPercent)).append(",")
                    .append("\"speedupFactor\":").append(String.format(Locale.US, "%.2f", r.speedupFactor))
                    .append("}");
                if (i < rows.size() - 1) json.append(",");
            }
            json.append("]}");

            sendJsonResponse(exchange, 200, json.toString());
        }
    }

    private static class StatusHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String json = "{\"status\":\"ONLINE\",\"project\":\"Fuzzy Search System Using Edit Distance & BK-Trees\",\"course\":\"DSA-3 (25CS2103E)\",\"university\":\"KLH University\"}";
            sendJsonResponse(exchange, 200, json);
        }
    }

    private static String escape(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
    }
}
