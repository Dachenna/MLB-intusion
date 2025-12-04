const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
// Simple CORS setup for frontend (React) development
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/**
 * Endpoint to process network feature data via the Python ML script.
 * Expects: { "features": [ duration, src_port, protocol_type, ... ] }
 */
app.post('/api/predict', (req, res) => {
    const { features } = req.body;
    
    if (!features || !Array.isArray(features)) {
        return res.status(400).json({ error: "Invalid features array provided." });
    }

    // 1. Prepare data for Python
    const inputData = JSON.stringify({ features });

    // 2. Spawn the Python process
    // NOTE: Use 'python' or 'python3' based on your environment setup
    const pythonProcess = spawn('python3', ['ml_model.py', inputData]);
    let pythonOutput = '';

    // 3. Capture Python's stdout (the JSON result)
    pythonProcess.stdout.on('data', (data) => {
        pythonOutput += data.toString();
    });

    // 4. Handle errors from Python (stderr)
    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python Error: ${data.toString()}`);
        // Only send an error response if no stdout data was captured
        if (!pythonOutput) {
             res.status(500).json({ error: "Failed to run ML prediction script." });
        }
    });

    // 5. When Python script exits
    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.log(`Python script exited with code ${code}`);
            // Check if error was already sent via stderr or if output is missing
            if (!res.headersSent && !pythonOutput) { 
                return res.status(500).json({ error: "ML script failed to return result." });
            }
        }
        
        try {
            // Parse the captured JSON string
            const result = JSON.parse(pythonOutput);
            console.log('Prediction Result:', result);
            res.json(result);

        } catch (e) {
            console.error('Failed to parse Python output as JSON:', pythonOutput);
            res.status(500).json({ error: "Invalid response from ML script." });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Node.js Server running on http://localhost:${PORT}`);
});