const assert = require('assert');

async function test() {
    console.log("Starting Tests...");
    const url = 'http://localhost:3000';

    try {
        // Testing /health
        console.log("Testing /health...");
        const healthRes = await fetch(`${url}/health`);
        const healthData = await healthRes.json();
        const expectedHealth = {
            "is_success": true,
            "official_email": "bhavesh1553.be23@chitkara.edu.in" // Expect default unless changed
        };

        // Normalize keys/values before assert if env var overrides
        if (healthData.official_email !== expectedHealth.official_email) {
             console.log(`Note: Email differs. Got '${healthData.official_email}', expected placeholder.`);
        }
        assert.equal(healthRes.status, 200, "Health status should be 200");
        assert.equal(healthData.is_success, true);
        console.log("Keys /health passed");


        // Test /bfhl - Fibonacci (Valid)
        console.log("Testing /bfhl - Fibonacci (Valid)...");
        const fibRes = await fetch(`${url}/bfhl`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "fibonacci": 5 })
        });
        const fibData = await fibRes.json();
        assert.equal(fibRes.status, 200);
        assert.deepStrictEqual(fibData.data, [0, 1, 1, 2, 3]);
        console.log("Keys Fibonacci passed");


        // Testing /bfhl - Fibonacci (Invalid Type -> 400)
        console.log("Testing /bfhl - Fibonacci (Invalid Type)...");
        const fibInvTypeRes = await fetch(`${url}/bfhl`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "fibonacci": "5" })
        });
        assert.equal(fibInvTypeRes.status, 400); // 400 Bad Request
        console.log("Keys Fibonacci Invalid Type passed");


        // Testing /bfhl - Fibonacci (Semantic Invalid -> 422)
        console.log("Testing /bfhl - Fibonacci (Negative)...");
        const fibNegRes = await fetch(`${url}/bfhl`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "fibonacci": -5 })
        });
        assert.equal(fibNegRes.status, 422); // 422 Unprocessable Entity
        console.log("Keys Fibonacci Negative passed");
        

        // Testing /bfhl - Prime (Valid)
        console.log("Testing /bfhl - Prime...");
        const primeRes = await fetch(`${url}/bfhl`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ "prime": [1, 2, 3, 4, 5, 6, 7] }) 
         });
         const primeData = await primeRes.json();
         assert.equal(primeRes.status, 200);

         assert.deepStrictEqual(primeData.data, [2, 3, 5, 7]);
         console.log("Keys Prime passed");


        // Testing /bfhl - LCM
        console.log("Testing /bfhl - LCM...");
        const lcmRes = await fetch(`${url}/bfhl`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ "lcm": [4, 6] }) 
         });
         const lcmData = await lcmRes.json();
         assert.equal(lcmRes.status, 200);
         assert.equal(lcmData.data, 12);
         console.log("Keys LCM passed");
         

        // Testing /bfhl - HCF
        console.log("Testing /bfhl - HCF...");
        const hcfRes = await fetch(`${url}/bfhl`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ "hcf": [8, 12, 20] }) 
          });
          const hcfData = await hcfRes.json();
          assert.equal(hcfRes.status, 200);
          assert.equal(hcfData.data, 4);
          console.log("Keys HCF passed");


        //Testing /bfhl - AI
        console.log("Testing /bfhl - AI...");
        const aiRes = await fetch(`${url}/bfhl`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({"AI": "What is the capital of India?" })
        });
        const aiData = await aiRes.json();
        assert.equal(aiRes.status, 200);
        assert.equal(aiData.data, "Delhi");
        console.log("Keys AI passed");  
    } catch (error) {
        console.error("Test Failed:", error);
        process.exit(1);
    }
}

test();
