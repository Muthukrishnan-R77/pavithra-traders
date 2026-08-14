import http from "http";

const BASE_URL = "http://localhost:3000";

async function measureRequest(path, options = {}) {
  const start = performance.now();
  const res = await fetch(`${BASE_URL}${path}`, options);
  const end = performance.now();
  const duration = Math.round(end - start);
  const text = await res.text();

  return {
    path,
    status: res.status,
    durationMs: duration,
    sizeBytes: text.length,
    headers: Object.fromEntries(res.headers.entries()),
    text,
  };
}

async function runTests() {
  console.log("==================================================");
  console.log("RUNNING PRODUCTION PERFORMANCE & VERIFICATION TESTS");
  console.log("==================================================");

  const tests = [
    { path: "/", desc: "Homepage (ISR)" },
    { path: "/cement", desc: "Cement Catalog (ISR)" },
    { path: "/steel", desc: "Steel Catalog (ISR)" },
    { path: "/products", desc: "All Products Catalog (ISR)" },
    { path: "/products/ultratech-cement", desc: "Product Slug Detail (SSG)" },
    { path: "/products/tata-tiscon-12mm", desc: "Steel Product Slug Detail (SSG)" },
    { path: "/cart", desc: "Shopping Cart Page" },
    { path: "/checkout", desc: "Checkout Page" },
    { path: "/about", desc: "About Us Page" },
    { path: "/contact", desc: "Contact Page" },
    { path: "/api/products", desc: "Public Products API (Cached)" },
    { path: "/api/products/ultratech-cement", desc: "Product by Slug API" },
    { path: "/logo.png", desc: "Brand Logo Asset" },
    { path: "/images/cement/ultratech.jpg", desc: "Product Image Asset" },
  ];

  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    try {
      const res = await measureRequest(t.path);
      const isOk = res.status >= 200 && res.status < 400;
      const statusIcon = isOk ? "✅ PASS" : "❌ FAIL";

      console.log(
        `${statusIcon} | ${t.desc.padEnd(35)} | Path: ${t.path.padEnd(30)} | Status: ${res.status} | Time: ${res.durationMs}ms | Size: ${(res.sizeBytes / 1024).toFixed(1)} KB`
      );

      if (isOk) {
        passed++;
      } else {
        failed++;
      }
    } catch (err) {
      console.error(`❌ ERROR | ${t.desc}:`, err.message);
      failed++;
    }
  }

  // Content Verification
  console.log("\n--- CONTENT INTEGRITY VERIFICATION ---");
  const home = await measureRequest("/");
  const checks = [
    { name: "Brand Name", pass: home.text.includes("PAVITHRA TRADERS") },
    { name: "Live Price Ticker", pass: home.text.includes("LIVE PRICES") },
    { name: "Cement Category", pass: home.text.includes("CEMENT") },
    { name: "Steel Category", pass: home.text.includes("STEEL &amp; TMT") || home.text.includes("STEEL & TMT") },
    { name: "UltraTech Brand", pass: home.text.includes("UltraTech") },
    { name: "Tata Tiscon Brand", pass: home.text.includes("Tata Tiscon") },
    { name: "WhatsApp Action", pass: home.text.includes("wa.me/919025644746") },
    { name: "Footer Details", pass: home.text.includes("All rights reserved") },
  ];

  for (const c of checks) {
    console.log(`${c.pass ? "✅" : "❌"} ${c.name.padEnd(25)}: ${c.pass ? "Found in initial HTML" : "NOT FOUND"}`);
  }

  console.log("\n==================================================");
  console.log(`SUMMARY: ${passed} / ${tests.length} tests passed (${failed} failed)`);
  console.log("==================================================");
}

runTests();
