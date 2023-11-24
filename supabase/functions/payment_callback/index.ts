Deno.serve(async (req) => {
  const responseJson = await req.json();
  console.log(responseJson);

  return new Response(
    JSON.stringify({ message: "thank you", statusCode: 200 }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
});
