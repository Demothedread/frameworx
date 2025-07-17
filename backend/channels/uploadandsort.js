// UploadAndSort backend channel: Accepts multiple uploads, routes them to LLM, sorts response by type
const router = require('express').Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// You'd want to replace this with actual LLM and OCR logic, but here's a stub:
function detectFileType(filename) {
  if (/\.(jpg|jpeg|png|gif)$/i.test(filename)) return 'images';
  if (/\.(pdf)$/i.test(filename)) return 'pdfs';
  if (/\.(docx?|txt)$/i.test(filename)) return 'docs';
  return 'other';
}


// --- Real OpenAI API integration ---
const { getEnv } = require('../utils/env');
// Require 'openai' npm package; instruct user to npm install
let OpenAI;
try {
  OpenAI = require('openai').OpenAI;
} catch (e) {
  console.error('Please run "npm install openai" in backend for LLM functionality!');
}


// Provider config (reloads per-request, so updates live!)
function getLLMConfig() {
  const env = getEnv();
  return {
    provider: env.LLM_PROVIDER||'openai',
    openai_key: env.OPENAI_API_KEY,
    openai_model: env.OPENAI_API_MODEL || 'gpt-4o',
    embedding_enable: env.EMBEDDING_ENABLE,
    google_key: env.GOOGLE_API_KEY,
    google_region: env.GOOGLE_VISION_REGION,
    deepseek_key: env.DEEPSEEK_API_KEY,
  };
}

let DeepSeekClient; let deepseekSetup = false;
try { DeepSeekClient = require('deepseek'); deepseekSetup = true; } catch {}
let {ImageAnnotatorClient} = (()=>{try{return require('@google-cloud/vision');}catch{return {}}})();

// Embedding storage: in-memory vector fallback (for demo); prod sugg: use DB or Pinecone/Weaviate
let vectorStore = [];
function storeVectorEmbedding(meta, embedding) {
  vectorStore.push({ meta, embedding });
  // TODO: Persist to DB/JSON file as needed - demo only.
}


// PDF, DOCX parsing libraries
let mammoth, pdfParse;
try {
  mammoth = require('mammoth');
} catch (e) { console.warn('npm install mammoth for .docx parsing'); }
try {
  pdfParse = require('pdf-parse');
} catch (e) { console.warn('npm install pdf-parse for PDF parsing'); }

// OCR/Image/vision support
// (Optional: Google Vision) - placeholder: let visionClient

async function tryExtractText(fileBuffer, filename) {
  if (/\.txt$/i.test(filename)) {
    return fileBuffer.toString('utf8');
  }
  if (/\.docx$/i.test(filename) && mammoth) {
    try {
      const { value } = await mammoth.extractRawText({ buffer: fileBuffer });
      return value;
    } catch (e) {
      return '';
    }
  }
  if (/\.pdf$/i.test(filename) && pdfParse) {
    try {
      const { text } = await pdfParse(fileBuffer);
      return text;
    } catch (e) {
      return '';
    }
  }
  return null;
}

/**
 * If image, build vision payload (base64)
 */
function tryPrepareVisionImagePayload(fileBuffer, filename) {
  if (/\.(jpg|jpeg|png|gif)$/i.test(filename)) {
    return fileBuffer.toString('base64');
  }
  return null;
}



async function processFileWithLLM(fileBuffer, filename, filetype, instructions) {
  const config = getLLMConfig();
  let openai = null;
  let openaiModel = config.openai_model || 'gpt-4o';
  if (OpenAI && config.openai_key && config.openai_key.length > 10) {
    openai = new OpenAI({ apiKey: config.openai_key });
  }
  let providerUsed = config.provider;

  let textContent = await tryExtractText(fileBuffer, filename);
  let visionBase64 = tryPrepareVisionImagePayload(fileBuffer, filename);

  // Choose provider based on env/config
  if (providerUsed === 'google' && config.google_key) {
    // Google Vision: Only supports images as demo here (extendable to doc AI)
    if (visionBase64 && ImageAnnotatorClient) {
      let client = new ImageAnnotatorClient({ key: config.google_key });
      try {
        const [result] = await client.textDetection(Buffer.from(fileBuffer));
        const detections = result.textAnnotations;
        return {
          filename,
          filetype,
          summary: detections && detections[0] ? detections[0].description : '',
          detected_objects: (detections||[]).slice(1).map(t=>t.description).join(', '),
          size: fileBuffer.length,
          note: result.error ? result.error.message : 'Google Vision',
        };
      } catch(e){
        return { filename, filetype, summary:'Google Vision error: '+e.message, size: fileBuffer.length, note:'--' };
      }
    } else {
      return { filename, filetype, summary:'Google Vision for non-image not implemented', size: fileBuffer.length, note:'--' };
    }
  } else if (providerUsed === 'deepseek' && deepseekSetup && config.deepseek_key) {
    // Placeholder: DeepSeek API integration
    return { filename, filetype, summary: 'DeepSeek API demo: not wired up yet.', size: fileBuffer.length, note: 'TODO: implement DeepSeek' };
  } else if (providerUsed === 'openai' && openai) {
    // OPENAI HANDLING (default)
    // Image: Vision multimodal
    if (visionBase64) {
      let contentArr = [
        { type: 'text', text: `Analyze this image file as for inventory/blog/research. Filename: ${filename}. User Instructions: ${instructions||'[none specified]'} --. Return result as a JSON object summarizing properties to fill a table, e.g. filename, filetype, summary, tags, detected_objects, and additionally any fields requested in user instructions.` },
        { type: 'image_url', image_url: { "url": `data:image/${filename.split('.').pop()};base64,${visionBase64}` } }
      ];
      let openaiResponse = null;
      try {
        openaiResponse = await openai.chat.completions.create({
          model: openaiModel,
          messages: [ { role:'system', content: 'You extract information from images for researchers, organizers, and cataloguers. Respond only with a single JSON object.' }, { role:'user', content: contentArr } ],
          temperature: 0.2, max_tokens: 600, response_format: { type: 'json_object' },
        });
      } catch (err) {
        return { filename, filetype, summary:`OpenAI vision error: ${err.message}`, size:fileBuffer.length, note:'--' };
      }
      let row = { filename, filetype, summary:'', size:fileBuffer.length, note:'' };
      if (openaiResponse && openaiResponse.choices && openaiResponse.choices[0]) {
        try { const obj = JSON.parse(openaiResponse.choices[0].message.content); row = { ...row, ...obj }; }
        catch(e) { row.summary = openaiResponse.choices[0].message.content; row.note = 'Vision LLM non-JSON output'; }
      }
      return row;
    }
    // Document/text prompt
    let systemPrompt = `You are an assistant. Your job is to return a JSON object summarizing the document with properties matching these columns: filename, filetype, summary, size, note. Also, fill fields requested by user instructions as top-level keys.`;
    let userText = '';
    if (instructions && instructions.trim().length > 0) userText += `\nUSER INSTRUCTIONS: ${instructions}\n`;
    userText += `\nHere is the document content (truncated if too long):\n---\n${textContent ? textContent.slice(0, 4000) : '[NO TEXT CONTENT AVAILABLE]'}\n---\n`;
    let openaiResponse = null;
    try {
      openaiResponse = await openai.chat.completions.create({
        model: openaiModel,
        messages: [ { role: 'system', content: systemPrompt }, { role: 'user', content: userText } ],
        temperature: 0.09, max_tokens: 700, response_format: { type: 'json_object' },
      });
    } catch (err) {
      return { filename, filetype, summary:`OpenAI error: ${err.message}`, size:fileBuffer.length, note:'--' };
    }
    // Parse JSON result
    let row = { filename, filetype, summary:'', size:fileBuffer.length, note:'LLM returned no JSON' };
    if (openaiResponse && openaiResponse.choices && openaiResponse.choices[0]) {
      try { const obj = JSON.parse(openaiResponse.choices[0].message.content); row = { ...row, ...obj }; }
      catch(e) { row.summary = openaiResponse.choices[0].message.content; row.note = 'LLM non-JSON output'; }
    }
    // --- Embedding demo (OpenAI only) ---
    if (config.embedding_enable && textContent && textContent.length > 10) {
      try {
        const result = await openai.embeddings.create({ input: textContent.slice(0,6000), model: 'text-embedding-ada-002' });
        if (result && result.data && result.data[0] && result.data[0].embedding) {
          storeVectorEmbedding({ filename, filetype, summary: row.summary }, result.data[0].embedding);
          row.has_embedding = true;
        } else { row.has_embedding = false; }
      } catch(e){ row.has_embedding = false; row.note += ' (embedding error)'; }
    }
    return row;
  }

  // If unsupported or not configured
  return { filename, filetype, summary:'No supported LLM provider configured/config active.', size: fileBuffer.length, note:'--' };
}

// Main POST endpoint: accepts file(s) and user instructions, returns sorted json tables
router.post('/', upload.array('files'), async (req, res) => {
  const instructions = req.body.instructions || '';
  const files = req.files || [];
  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No files received.' });
  }
  // Map to type, call processing stub
  const tableRowsByType = {};
  for (const f of files) {
    const type = detectFileType(f.originalname);
    const row = await processFileWithLLM(f.buffer, f.originalname, type, instructions);
    if (!tableRowsByType[type]) tableRowsByType[type] = [];
    tableRowsByType[type].push(row);
  }
  // Build columns for each type from the first row's keys, required for MUI DataGrid
  const tables = {};
  for (const t in tableRowsByType) {
    const rows = tableRowsByType[t].map((r,i) => ({ id: i+1, ...r }));
    // Columns: keys from a sample row
    const columns = Object.keys(rows[0] || {}).filter(k => k !== 'id').map(k => ({ field: k, headerName: k.charAt(0).toUpperCase()+k.slice(1), flex: 1 }));
    tables[t] = { columns, rows };
  }
  res.json({ tables });
});

module.exports = router;
// Simple vector KNN search for demo: POST /api/uploadandsort/vquery { vector: [float...], k: int }
const cosineSimilarity = (a,b) => {
  let dot=0, aMag=0, bMag=0;
  for(let i=0;i<a.length && i<b.length;i++) { dot+=a[i]*b[i]; aMag+=a[i]*a[i]; bMag+=b[i]*b[i]; }
  return (aMag && bMag) ? (dot / (Math.sqrt(aMag)*Math.sqrt(bMag))) : 0;
};

router.post('/vquery', async (req, res) => {
  if(!('vector' in req.body && Array.isArray(req.body.vector))) {
    return res.status(400).json({ error:'vector field required; pass e.g. { vector: [0.12,...], k:5 }' });
  }
  let k = Math.max(1, Math.min(parseInt(req.body.k||5), 30));
  if (vectorStore.length===0) return res.json({results:[], count:0});
  let v = req.body.vector;
  // Find closest in vectorStore
  let scored = vectorStore.map(entry=>(
    { entry, sim: cosineSimilarity(v, entry.embedding) }
  ));
  scored.sort((a,b)=>b.sim-a.sim);
  res.json({
    results: scored.slice(0, k).map(r=>({ meta: r.entry.meta, sim: r.sim })),
    count: vectorStore.length
  });
});
