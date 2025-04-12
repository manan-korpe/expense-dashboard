import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

function App() {
  const [file, setFile] = useState(null);
  const [totalBill, setTotalBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setTotalBill(null);
    setError('');
  };

  const extractTotalBill = (text) => {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    let totalBill = null;

    // Define possible keywords for total
    const totalKeywords = [
      /(total|offer total|next bill|grand total)\s*[:\-=\s]?\s*([0-9,.]+(?:\s?[₹$€£]?)?)$/i
    ];

    // Check lines for total keywords
    lines.forEach((line) => {
      const cleanedLine = line.replace(/\s{2,}/g, ' ').trim();

      totalKeywords.forEach(keywordRegex => {
        const match = cleanedLine.match(keywordRegex);
        if (match) {
          totalBill = match[2].trim();
        }
      });
    });

    return totalBill;
  };

  const handleScan = () => {
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();

    reader.onload = async () => {
      const imageData = reader.result;

      try {
        const result = await Tesseract.recognize(imageData, 'eng', {
          logger: (m) => console.log(m),
        });

        const text = result.data.text;
        const total = extractTotalBill(text);

        if (!total) {
          setError('❌ Total not found. Try a clearer image.');
        } else {
          setTotalBill(total);
        }
      } catch (err) {
        console.error(err);
        setError('⚠️ Error reading image.');
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🧾 Total Bill Scanner</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleScan} style={{ marginTop: 10 }} disabled={!file || loading}>
        {loading ? 'Scanning...' : 'Scan Bill'}
      </button>

      {error && <p style={{ color: 'red', marginTop: 20 }}>{error}</p>}

      {totalBill && (
        <div style={{ marginTop: 20 }}>
          <h3>💰 Extracted Total:</h3>
          <p>{totalBill}</p>
        </div>
      )}
    </div>
  );
}

export default App;
