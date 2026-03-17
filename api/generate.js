export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, model, size, style } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Build a richer prompt by appending style
  const fullPrompt = style && style !== 'Cinematic'
    ? `${prompt}, ${style} style`
    : `${prompt}, cinematic lighting, highly detailed, 4k`;

  // Map size selection to HF dimensions
  const sizeMap = {
    '1024×1024 (Square)':   { width: 1024, height: 1024 },
    '1792×1024 (Wide)':     { width: 1280, height: 720  },
    '1024×1792 (Portrait)': { width: 720,  height: 1280 },
    '512×512 (Small)':      { width: 512,  height: 512  },
  };
  const dimensions = sizeMap[size] || { width: 1024, height: 1024 };

  // Model map — all free on HF Inference API
  const modelMap = {
    'Midilli v2 (Fast)':         'stabilityai/stable-diffusion-2-1',
    'Midilli Pro (High Quality)': 'stabilityai/stable-diffusion-xl-base-1.0',
    'SDXL Turbo':                'stabilityai/sdxl-turbo',
    'Stable Diffusion 3':        'stabilityai/stable-diffusion-3-medium-diffusers',
  };
  const hfModel = modelMap[model] || 'stabilityai/stable-diffusion-2-1';

  const HF_API_KEY = process.env.HF_API_KEY;

  if (!HF_API_KEY) {
    return res.status(500).json({ error: 'API key not configured on server.' });
  }

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${hfModel}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: fullPrompt,
          parameters: {
            width: dimensions.width,
            height: dimensions.height,
            num_inference_steps: 30,
            guidance_scale: 7.5,
            num_images_per_prompt: 1,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      // Model is loading — HF free tier cold-starts
      if (response.status === 503) {
        return res.status(503).json({
          error: 'Model is warming up. Please try again in 20–30 seconds.',
        });
      }
      return res.status(response.status).json({ error: errText });
    }

    // HF returns raw image bytes
    const imageBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(imageBuffer).toString('base64');

    return res.status(200).json({ image: `data:image/jpeg;base64,${base64}` });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
