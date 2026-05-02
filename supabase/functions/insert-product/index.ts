import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Step 1: Add 'cascao' to enum via rpc (using a DO block)
    const { error: enumError } = await supabase.rpc('exec_sql', {
      query: "ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'cascao'"
    }).single();

    // If rpc doesn't exist, try direct approach
    if (enumError) {
      // Try inserting with casquinha first, then we'll update
      console.log("RPC not available, trying alternative approach:", enumError.message);
    }

    // Step 2: Insert the product with casquinha (existing category) as fallback
    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("code", "8894")
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ success: true, message: "Product already exists" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data, error } = await supabase.from("products").insert({
      name: "CASCÃO DE SORVETE CROCANTE",
      code: "8894",
      category: "casquinha",
      units_per_box: 10,
      boxes_per_crate: 1,
      units_per_crate: 10,
      unit_price: 8.50,
      active: true,
    }).select().single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, product: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
