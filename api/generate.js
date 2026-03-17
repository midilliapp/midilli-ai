export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt gerekli' });
  }

  try {
    const response = await fetch(
      "https://fal.run/fal-ai/flux/dev",
      {
        method: "POST",
        headers: {
          "Authorization": `Key ${process.env.FAL_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          image_size: "landscape_4_3",
          num_inference_steps: 28,
          num_images: 1,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }

    const data = await response.json();
    const imageUrl = data.images[0].url;

    res.status(200).json({ image: imageUrl });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
