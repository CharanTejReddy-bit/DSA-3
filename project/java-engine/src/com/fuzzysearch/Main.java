package com.fuzzysearch;

import com.fuzzysearch.benchmark.BenchmarkRunner;
import com.fuzzysearch.cli.FuzzySearchCLI;
import com.fuzzysearch.gui.FuzzySearchGUI;
import com.fuzzysearch.server.FuzzySearchServer;

import javax.swing.*;
import java.awt.*;

/**
 * Main Entrypoint for Fuzzy Search System (Java DSA Project)
 * Course: Data Structures and Algorithms - 3 (25CS2103E)
 * KLH University (Bachupally)
 * Team 2: CharanTej Reddy, Chandrakanth Reddy, Teja
 * Guide: Mrs. J. Yamini Devi, Assistant Professor
 */
public class Main {

    public static void main(String[] args) {
        if (args.length > 0) {
            String mode = args[0].toLowerCase();
            switch (mode) {
                case "--cli":
                    new FuzzySearchCLI().start();
                    return;
                case "--server":
                    int port = 8080;
                    if (args.length > 1) {
                        try { port = Integer.parseInt(args[1]); } catch (Exception ignored) {}
                    }
                    startServer(port);
                    return;
                case "--benchmark":
                    BenchmarkRunner.printReport("algrithm", 2);
                    return;
                case "--gui":
                    launchGUI();
                    return;
                default:
                    System.out.println("Unknown argument: " + mode);
                    System.out.println("Usage options: [--gui | --cli | --server [port] | --benchmark]");
                    break;
            }
        }

        // Default behavior: check if GUI is supported, otherwise launch CLI
        if (!GraphicsEnvironment.isHeadless()) {
            try {
                launchGUI();
            } catch (Throwable t) {
                System.out.println("GUI not available on this display, falling back to CLI...");
                new FuzzySearchCLI().start();
            }
        } else {
            new FuzzySearchCLI().start();
        }
    }

    private static void launchGUI() {
        SwingUtilities.invokeLater(() -> {
            try {
                // Try system look and feel
                UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
            } catch (Exception ignored) {}
            new FuzzySearchGUI().setVisible(true);
        });
    }

    private static void startServer(int port) {
        try {
            FuzzySearchServer server = new FuzzySearchServer(port);
            server.start();
            System.out.println("Press Ctrl+C to stop server.");
            Thread.currentThread().join();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
