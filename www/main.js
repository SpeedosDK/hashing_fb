import init, { hash_passwords } from '../pkg/hashing_fb.js';

await init();

const fileInput = document.getElementById("fileInput");
fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;

    const text = await file.text();
    const words = text.split(/\s+/).filter(w => w.length > 0);
    document.getElementById("input").textContent = `${file.name} (${words.length} ord)`;

    // --- Rust / WASM SHA256 ---
    const t0wasm = performance.now();
    const wasmResults = hash_passwords(text);
    const t1wasm = performance.now();
    const elapsedWasm = (t1wasm - t0wasm).toFixed(2);

    // --- JavaScript SHA256 ---
    async function sha256(word) {
        const buffer = new TextEncoder().encode(word);
        const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
        return Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");
    }

    const t0js = performance.now();
    const jsResults = await Promise.all(
        words.map(async word => ({ word, hash: await sha256(word) }))
    );
    const t1js = performance.now();
    const elapsedJs = (t1js - t0js).toFixed(2);

    // --- Vis tid ---
    const wasmCell = document.getElementById("time-wasm");
    const jsCell   = document.getElementById("time-js");
    wasmCell.textContent = `${elapsedWasm} ms`;
    jsCell.textContent   = `${elapsedJs} ms`;

    wasmCell.classList.remove("fast", "slow");
    jsCell.classList.remove("fast", "slow");

    if (parseFloat(elapsedWasm) < parseFloat(elapsedJs)) {
        wasmCell.classList.add("fast");
        jsCell.classList.add("slow");
    } else {
        jsCell.classList.add("fast");
        wasmCell.classList.add("slow");
    }

    // --- Vis resultater ---
    const tbody = document.getElementById("results-body");
    tbody.innerHTML = ""; // ryd tidligere resultater

    for (let i = 0; i < wasmResults.length; i++) {
        const match = wasmResults[i].hash === jsResults[i].hash ? "✅" : "❌";
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${wasmResults[i].word}</td>
            <td>${wasmResults[i].hash}</td>
            <td>${jsResults[i].hash}</td>
            <td>${match}</td>
        `;
        tbody.appendChild(tr);
    }
});
