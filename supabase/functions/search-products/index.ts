declare const Deno: {
  serve: (handler: (req: Request) => Promise<Response>) => void;
  env: {
    get: (key: string) => string | undefined;
  };
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, size } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('SERPAPI_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'SERPAPI_KEY not configured. Please add it in project secrets.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const searchQuery = encodeURIComponent(query);
    const url = `https://serpapi.com/search.json?engine=google_shopping&q=${searchQuery}&gl=in&hl=en&api_key=${apiKey}`;

    console.log('Searching Google Shopping for:', query);

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error('SerpAPI error:', data);
      return new Response(
        JSON.stringify({ error: 'Search API error', details: data }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const products = (data.shopping_results || []).slice(0, 16).map((item: any) => ({
      title: item.title || '',
      price: item.extracted_price ? `₹${item.extracted_price}` : (item.price || 'N/A'),
      link: item.link || item.product_link || '#',
      source: item.source || 'Google Shopping',
      thumbnail: item.thumbnail || '',
      snippet: item.snippet || '',
    }));

    console.log(`Found ${products.length} products`);

    return new Response(
      JSON.stringify({ products }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Search error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Search failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
