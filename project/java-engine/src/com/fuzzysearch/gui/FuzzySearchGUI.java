package com.fuzzysearch.gui;

import com.fuzzysearch.benchmark.BenchmarkRunner;
import com.fuzzysearch.core.EditDistance;
import com.fuzzysearch.data.DictionaryLoader;
import com.fuzzysearch.tree.BKTree;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Modern Java Swing Desktop GUI for Fuzzy Search Project
 * Course: Data Structures and Algorithms - 3 (25CS2103E)
 * Team: CharanTej Reddy (2520030422), Chandrakanth Reddy (2520030290), Teja (2520030379)
 * University: KLH University, Bachupally
 */
public class FuzzySearchGUI extends JFrame {

    private final Map<String, BKTree> dictionaryTrees = new HashMap<>();
    private final Map<String, List<String>> dictionaryWords = new HashMap<>();

    // UI Controls
    private JTextField searchField;
    private JSlider toleranceSlider;
    private JLabel toleranceLabel;
    private JComboBox<String> dictCombo;
    private JTable resultsTable;
    private DefaultTableModel resultsTableModel;

    // Telemetry labels
    private JLabel latencyLabel;
    private JLabel visitedLabel;
    private JLabel savingsLabel;
    private JLabel matchesCountLabel;

    // DP Matrix tab components
    private JTextField matrixSourceField;
    private JTextField matrixTargetField;
    private JTable matrixTable;
    private DefaultTableModel matrixTableModel;
    private JLabel matrixDistanceLabel;
    private JLabel matrixScoreLabel;
    private JTextArea alignmentArea;

    // Benchmark tab components
    private JTable benchmarkTable;
    private DefaultTableModel benchmarkTableModel;
    private JButton runBenchmarkBtn;

    public FuzzySearchGUI() {
        super("Fuzzy Search System | Edit Distance & BK-Trees | DSA-3 Project");
        initData();
        initUI();
    }

    private void initData() {
        dictionaryWords.put("CS & Algorithms", DictionaryLoader.TECH_CS_WORDS);
        dictionaryWords.put("Common English", DictionaryLoader.COMMON_ENGLISH);
        dictionaryWords.put("Medical Terms", DictionaryLoader.MEDICAL_WORDS);
        dictionaryWords.put("Multilingual Unicode", DictionaryLoader.MULTILINGUAL_WORDS);

        for (Map.Entry<String, List<String>> e : dictionaryWords.entrySet()) {
            dictionaryTrees.put(e.getKey(), new BKTree(e.getValue()));
        }
    }

    private void initUI() {
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1000, 700);
        setLocationRelativeTo(null);

        // Dark theme color palette
        Color bgDark = new Color(15, 23, 42);
        Color bgPanel = new Color(30, 41, 59);
        Color fgWhite = new Color(248, 250, 252);
        Color accentCyan = new Color(6, 182, 212);

        JPanel mainPanel = new JPanel(new BorderLayout(10, 10));
        mainPanel.setBackground(bgDark);
        mainPanel.setBorder(new EmptyBorder(12, 12, 12, 12));

        // Header
        JPanel headerPanel = new JPanel(new BorderLayout());
        headerPanel.setBackground(bgPanel);
        headerPanel.setBorder(new EmptyBorder(12, 16, 12, 16));

        JLabel titleLabel = new JLabel("Fuzzy Search System: Edit Distance & Metric Trees");
        titleLabel.setFont(new Font("Segoe UI", Font.BOLD, 18));
        titleLabel.setForeground(fgWhite);

        JLabel subLabel = new JLabel("KLH University • DSA-3 (25CS2103E) • Team 2: CharanTej Reddy, Chandrakanth Reddy, Teja • Guide: Mrs. J. Yamini Devi");
        subLabel.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        subLabel.setForeground(accentCyan);

        headerPanel.add(titleLabel, BorderLayout.NORTH);
        headerPanel.add(subLabel, BorderLayout.SOUTH);
        mainPanel.add(headerPanel, BorderLayout.NORTH);

        // Tabbed Pane
        JTabbedPane tabbedPane = new JTabbedPane();
        tabbedPane.setFont(new Font("Segoe UI", Font.BOLD, 13));

        tabbedPane.addTab("Search Playground", createSearchPanel());
        tabbedPane.addTab("2D Edit Distance Matrix", createMatrixPanel());
        tabbedPane.addTab("Performance Benchmarks", createBenchmarkPanel());

        mainPanel.add(tabbedPane, BorderLayout.CENTER);
        setContentPane(mainPanel);

        // Initial search
        performSearch();
    }

    private JPanel createSearchPanel() {
        JPanel panel = new JPanel(new BorderLayout(10, 10));
        panel.setBackground(new Color(15, 23, 42));
        panel.setBorder(new EmptyBorder(10, 10, 10, 10));

        // Top Query controls
        JPanel controlsPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 15, 8));
        controlsPanel.setBackground(new Color(30, 41, 59));

        JLabel qLabel = new JLabel("Query:");
        qLabel.setForeground(Color.WHITE);
        searchField = new JTextField("algrithm", 16);
        searchField.setFont(new Font("Consolas", Font.PLAIN, 14));
        searchField.getDocument().addDocumentListener(new DocumentListener() {
            public void insertUpdate(DocumentEvent e) { performSearch(); }
            public void removeUpdate(DocumentEvent e) { performSearch(); }
            public void changedUpdate(DocumentEvent e) { performSearch(); }
        });

        JLabel dLabel = new JLabel("Dictionary:");
        dLabel.setForeground(Color.WHITE);
        dictCombo = new JComboBox<>(new String[]{"CS & Algorithms", "Common English", "Medical Terms", "Multilingual Unicode"});
        dictCombo.addActionListener(e -> performSearch());

        JLabel tLabel = new JLabel("Tolerance (k):");
        tLabel.setForeground(Color.WHITE);
        toleranceSlider = new JSlider(1, 4, 2);
        toleranceSlider.setBackground(new Color(30, 41, 59));
        toleranceSlider.setPreferredSize(new Dimension(100, 24));
        toleranceLabel = new JLabel("2");
        toleranceLabel.setFont(new Font("Segoe UI", Font.BOLD, 14));
        toleranceLabel.setForeground(new Color(6, 182, 212));
        toleranceSlider.addChangeListener(e -> {
            toleranceLabel.setText(String.valueOf(toleranceSlider.getValue()));
            performSearch();
        });

        controlsPanel.add(qLabel);
        controlsPanel.add(searchField);
        controlsPanel.add(dLabel);
        controlsPanel.add(dictCombo);
        controlsPanel.add(tLabel);
        controlsPanel.add(toleranceSlider);
        controlsPanel.add(toleranceLabel);

        panel.add(controlsPanel, BorderLayout.NORTH);

        // Results Table
        String[] cols = {"Rank", "Candidate Word", "Edit Distance (d)", "Similarity Score", "Tree Depth"};
        resultsTableModel = new DefaultTableModel(cols, 0) {
            public boolean isCellEditable(int row, int column) { return false; }
        };
        resultsTable = new JTable(resultsTableModel);
        resultsTable.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        resultsTable.setRowHeight(24);
        resultsTable.getTableHeader().setFont(new Font("Segoe UI", Font.BOLD, 13));

        JScrollPane scrollPane = new JScrollPane(resultsTable);
        panel.add(scrollPane, BorderLayout.CENTER);

        // Bottom Telemetry Bar
        JPanel telemetryPanel = new JPanel(new GridLayout(1, 4, 10, 0));
        telemetryPanel.setBackground(new Color(30, 41, 59));
        telemetryPanel.setBorder(new EmptyBorder(8, 12, 8, 12));

        latencyLabel = createMetricBadge("Latency", "<0.1 ms");
        visitedLabel = createMetricBadge("Nodes Evaluated", "0");
        savingsLabel = createMetricBadge("Pruned Savings", "0%");
        matchesCountLabel = createMetricBadge("Ranked Matches", "0");

        telemetryPanel.add(latencyLabel);
        telemetryPanel.add(visitedLabel);
        telemetryPanel.add(savingsLabel);
        telemetryPanel.add(matchesCountLabel);

        panel.add(telemetryPanel, BorderLayout.SOUTH);
        return panel;
    }

    private JLabel createMetricBadge(String title, String val) {
        JLabel l = new JLabel("<html><center><font color='#94a3b8' size='2'>" + title + "</font><br><font color='#38bdf8' size='4'><b>" + val + "</b></font></center></html>", SwingConstants.CENTER);
        return l;
    }

    private void performSearch() {
        String q = searchField.getText().trim();
        String dict = (String) dictCombo.getSelectedItem();
        int k = toleranceSlider.getValue();

        BKTree tree = dictionaryTrees.get(dict);
        if (tree == null) return;

        BKTree.SearchResult res = tree.search(q, k);

        // Update telemetry
        latencyLabel.setText("<html><center><font color='#94a3b8' size='2'>Latency</font><br><font color='#38bdf8' size='4'><b>" + String.format("%.2f ms", res.getSearchTimeMs()) + "</b></font></center></html>");
        visitedLabel.setText("<html><center><font color='#94a3b8' size='2'>Nodes Evaluated</font><br><font color='#38bdf8' size='4'><b>" + res.getVisitedNodesCount() + " / " + res.getTotalNodesInTree() + "</b></font></center></html>");
        savingsLabel.setText("<html><center><font color='#94a3b8' size='2'>Pruned Savings</font><br><font color='#10b981' size='4'><b>" + String.format("%.1f%%", res.getPrunedPercentage()) + "</b></font></center></html>");
        matchesCountLabel.setText("<html><center><font color='#94a3b8' size='2'>Ranked Matches</font><br><font color='#f59e0b' size='4'><b>" + res.getMatches().size() + "</b></font></center></html>");

        // Update table
        resultsTableModel.setRowCount(0);
        int rank = 1;
        for (BKTree.SearchMatch m : res.getMatches()) {
            resultsTableModel.addRow(new Object[]{
                    "#" + (rank++),
                    m.getWord(),
                    m.getDistance(),
                    String.format("%.1f %%", m.getSimilarityScore() * 100),
                    m.getDepth()
            });
        }
    }

    private JPanel createMatrixPanel() {
        JPanel panel = new JPanel(new BorderLayout(10, 10));
        panel.setBackground(new Color(15, 23, 42));
        panel.setBorder(new EmptyBorder(10, 10, 10, 10));

        JPanel top = new JPanel(new FlowLayout(FlowLayout.LEFT, 12, 8));
        top.setBackground(new Color(30, 41, 59));

        JLabel sLbl = new JLabel("Source (s):");
        sLbl.setForeground(Color.WHITE);
        matrixSourceField = new JTextField("algrithm", 12);

        JLabel tLbl = new JLabel("Target (t):");
        tLbl.setForeground(Color.WHITE);
        matrixTargetField = new JTextField("algorithm", 12);

        JButton computeBtn = new JButton("Compute 2D Matrix");
        computeBtn.setBackground(new Color(6, 182, 212));
        computeBtn.setForeground(Color.BLACK);
        computeBtn.addActionListener(e -> updateMatrix());

        top.add(sLbl);
        top.add(matrixSourceField);
        top.add(tLbl);
        top.add(matrixTargetField);
        top.add(computeBtn);

        panel.add(top, BorderLayout.NORTH);

        // Matrix table
        matrixTableModel = new DefaultTableModel();
        matrixTable = new JTable(matrixTableModel);
        matrixTable.setFont(new Font("Consolas", Font.PLAIN, 13));
        matrixTable.setRowHeight(24);
        DefaultTableCellRenderer centerRenderer = new DefaultTableCellRenderer();
        centerRenderer.setHorizontalAlignment(JLabel.CENTER);
        matrixTable.setDefaultRenderer(Object.class, centerRenderer);

        JScrollPane scroll = new JScrollPane(matrixTable);
        panel.add(scroll, BorderLayout.CENTER);

        // Bottom stats
        JPanel bottom = new JPanel(new BorderLayout(10, 5));
        bottom.setBackground(new Color(30, 41, 59));
        bottom.setBorder(new EmptyBorder(8, 12, 8, 12));

        JPanel info = new JPanel(new FlowLayout(FlowLayout.LEFT, 20, 5));
        info.setBackground(new Color(30, 41, 59));
        matrixDistanceLabel = new JLabel("Edit Distance: -");
        matrixDistanceLabel.setFont(new Font("Segoe UI", Font.BOLD, 14));
        matrixDistanceLabel.setForeground(new Color(6, 182, 212));

        matrixScoreLabel = new JLabel("Similarity: -");
        matrixScoreLabel.setFont(new Font("Segoe UI", Font.BOLD, 14));
        matrixScoreLabel.setForeground(new Color(16, 185, 129));

        info.add(matrixDistanceLabel);
        info.add(matrixScoreLabel);
        bottom.add(info, BorderLayout.NORTH);

        alignmentArea = new JTextArea(2, 40);
        alignmentArea.setFont(new Font("Consolas", Font.PLAIN, 12));
        alignmentArea.setEditable(false);
        bottom.add(new JScrollPane(alignmentArea), BorderLayout.CENTER);

        panel.add(bottom, BorderLayout.SOUTH);

        updateMatrix();
        return panel;
    }

    private void updateMatrix() {
        String s = matrixSourceField.getText().trim();
        String t = matrixTargetField.getText().trim();
        if (s.isEmpty()) s = "a";
        if (t.isEmpty()) t = "a";

        EditDistance.DPMatrixResult res = EditDistance.computeDetailedMatrix(s, t);
        int[][] mat = res.getMatrix();
        List<String> sTokens = res.getSourceTokens();
        List<String> tTokens = res.getTargetTokens();

        // Build columns
        String[] cols = new String[tTokens.size() + 2];
        cols[0] = "D[i,j]";
        cols[1] = "ε";
        for (int j = 0; j < tTokens.size(); j++) cols[j + 2] = tTokens.get(j);

        matrixTableModel.setDataVector(new Object[0][0], cols);

        // Row 0
        Object[] row0 = new Object[cols.length];
        row0[0] = "ε";
        for (int j = 0; j <= tTokens.size(); j++) row0[j + 1] = mat[0][j];
        matrixTableModel.addRow(row0);

        // Rows 1..m
        for (int i = 0; i < sTokens.size(); i++) {
            Object[] row = new Object[cols.length];
            row[0] = sTokens.get(i);
            for (int j = 0; j <= tTokens.size(); j++) {
                row[j + 1] = mat[i + 1][j];
            }
            matrixTableModel.addRow(row);
        }

        matrixDistanceLabel.setText("Edit Distance (d): " + res.getDistance());
        matrixScoreLabel.setText("Normalized Similarity: " + String.format("%.1f %%", res.getSimilarityScore() * 100));

        StringBuilder sb = new StringBuilder("Optimal Alignment Operations: ");
        for (EditDistance.AlignmentStep step : res.getAlignment()) {
            sb.append(step.toString()).append(" ");
        }
        alignmentArea.setText(sb.toString());
    }

    private JPanel createBenchmarkPanel() {
        JPanel panel = new JPanel(new BorderLayout(10, 10));
        panel.setBackground(new Color(15, 23, 42));
        panel.setBorder(new EmptyBorder(12, 12, 12, 12));

        JPanel top = new JPanel(new FlowLayout(FlowLayout.LEFT, 15, 8));
        top.setBackground(new Color(30, 41, 59));

        runBenchmarkBtn = new JButton("Run Live Big-O Benchmark Suite");
        runBenchmarkBtn.setBackground(new Color(16, 185, 129));
        runBenchmarkBtn.setForeground(Color.BLACK);
        runBenchmarkBtn.setFont(new Font("Segoe UI", Font.BOLD, 13));
        runBenchmarkBtn.addActionListener(e -> runBenchmark());

        top.add(runBenchmarkBtn);
        panel.add(top, BorderLayout.NORTH);

        String[] cols = {"Scale", "Naive Time (ms)", "BK-Tree Time (ms)", "Naive Comparisons", "BK-Tree Evaluated", "Pruned Savings (%)", "Speedup Factor"};
        benchmarkTableModel = new DefaultTableModel(cols, 0) {
            public boolean isCellEditable(int r, int c) { return false; }
        };
        benchmarkTable = new JTable(benchmarkTableModel);
        benchmarkTable.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        benchmarkTable.setRowHeight(26);
        benchmarkTable.getTableHeader().setFont(new Font("Segoe UI", Font.BOLD, 13));

        panel.add(new JScrollPane(benchmarkTable), BorderLayout.CENTER);

        // Run default benchmark
        runBenchmark();
        return panel;
    }

    private void runBenchmark() {
        runBenchmarkBtn.setEnabled(false);
        runBenchmarkBtn.setText("Benchmarking...");

        SwingWorker<List<BenchmarkRunner.BenchmarkRow>, Void> worker = new SwingWorker<>() {
            protected List<BenchmarkRunner.BenchmarkRow> doInBackground() {
                return BenchmarkRunner.runSuite("algrithm", 2);
            }

            protected void done() {
                try {
                    List<BenchmarkRunner.BenchmarkRow> rows = get();
                    benchmarkTableModel.setRowCount(0);
                    for (BenchmarkRunner.BenchmarkRow r : rows) {
                        benchmarkTableModel.addRow(new Object[]{
                                r.label,
                                String.format("%.2f ms", r.naiveTimeMs),
                                String.format("%.2f ms", r.bkTreeTimeMs),
                                r.naiveComparisons,
                                r.bkTreeVisited,
                                String.format("%.1f %%", r.comparisonsSavedPercent),
                                String.format("%.2fx", r.speedupFactor)
                        });
                    }
                } catch (Exception ex) {
                    ex.printStackTrace();
                } finally {
                    runBenchmarkBtn.setEnabled(true);
                    runBenchmarkBtn.setText("Run Live Big-O Benchmark Suite");
                }
            }
        };
        worker.execute();
    }
}
