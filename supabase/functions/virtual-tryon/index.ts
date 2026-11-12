const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userImage, clothingImage, clothingDescription } = await req.json();

    if (!userImage || !clothingImage) {
      return new Response(
        JSON.stringify({ error: 'Both userImage and clothingImage are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('REPLICATE_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'REPLICATE_API_KEY not configured. Please add it in project secrets.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Starting virtual try-on...');

    // Use IDM-VTON model on Replicate for virtual try-on
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'c871bb9b046c1e65f28f79e29e40e6784e0442601be32b45f8f3f8fd767da0df',
        input: {
          human_img: userImage,
          garm_img: clothingImage,
          garment_des: clothingDescription || 'clothing item',
        },
      }),
    });

    const prediction = await response.json();

    if (!response.ok) {
      console.error('Replicate error:', prediction);
      return new Response(
        JSON.stringify({ error: prediction.detail || 'Failed to start try-on' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Poll for result
    let result = prediction;
    const maxAttempts = 60;
    for (let i = 0; i < maxAttempts; i++) {
      if (result.status === 'succeeded') break;
      if (result.status === 'failed' || result.status === 'canceled') {
        return new Response(
          JSON.stringify({ error: `Try-on ${result.status}: ${result.error || 'Unknown error'}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      await new Promise((r) => setTimeout(r, 2000));

      const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: { 'Authorization': `Bearer ${apiKey}` },
      });
      result = await pollRes.json();
    }

    if (result.status !== 'succeeded') {
      return new Response(
        JSON.stringify({ error: 'Try-on timed out. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const resultImage = Array.isArray(result.output) ? result.output[0] : result.output;
    console.log('Try-on completed successfully');

    return new Response(
      JSON.stringify({ resultImage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Try-on error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Try-on failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
