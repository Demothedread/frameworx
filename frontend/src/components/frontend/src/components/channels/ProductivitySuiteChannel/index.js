import React, { useState } from 'react';
import FileUploader from './FileUploader';
import FileTypeTabs from './FileTypeTabs';
import InstructionBox from './InstructionBox';
import ResultTable from './ResultTable';
import BatchProcessButton from './BatchProcessButton';
import { useLLMApi } from '../../shared/llmApi';

// Main Productivity/Database Suite Channel
export default function ProductivitySuiteChannel() {
  const [uploaded, setUploaded] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({}); // { fileName: {col: val, ...}, ... }
  const llmApi = useLLMApi();

  React.useEffect(() => {
    // On file change, reset selectedType
    if (uploaded.length > 0) {
      const ext = uploaded[0].name.split('.').pop().toLowerCase();
      setSelectedType(ext);
    } else {
      setSelectedType('');
      setResults({});
    }
  }, [uploaded]);

  const filesByType = {};
  uploaded.forEach(f => {
    const ext = (f.name.split('.').pop() || 'unknown').toLowerCase();
    if (!filesByType[ext]) filesByType[ext] = [];
    filesByType[ext].push(f);
  });

  const currentFiles = filesByType[selectedType] || [];

  // Get distinct columns from all responses for shown files
  let shownResults = [];
  let allColumns = new Set();
  currentFiles.forEach(f => {
    if (results[f.name]) {
      shownResults.push(results[f.name]);
      Object.keys(results[f.name]).forEach(k => allColumns.add(k));
    }
  });

  const processFiles = async () => {
    setLoading(true);
    let newResults = { ...results };
    for (let f of uploaded) {
      // Only send files that lack results
      if (newResults[f.name]) continue;
      const body = new FormData();
      body.append('file', f);
      body.append('instructions', instructions);
      // Basic endpoint stub
      try {
        const resp = await llmApi.extractInfo(body);
        newResults[f.name] = resp;
      } catch (e) {
        newResults[f.name] = { Error: 'LLM/API failed' };
      }
    }
    setResults(newResults);
    setLoading(false);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Productivity Suite/Database Channel</h2>
      <FileUploader onFilesSelected={setUploaded} />
      {uploaded.length > 0 && (
        <>
          <FileTypeTabs files={uploaded} selectedType={selectedType} setSelectedType={setSelectedType} />
          <InstructionBox value={instructions} setValue={setInstructions} />
          <BatchProcessButton onProcess={processFiles} loading={loading} />
          <ResultTable resultRows={shownResults} columns={[...allColumns]} />
        </>
      )}
    </div>
  );
}
