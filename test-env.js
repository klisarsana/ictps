console.log("Service Key:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "EXISTS" : "MISSING");
console.log("Keys:", Object.keys(process.env).filter(k => k.includes('SUPABASE')));
