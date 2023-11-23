Deno.serve(async (req) => {
  const { name } = await req.json();
  const data = {
    message: `Hello ${name}, we received your request!`,
  };

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});
