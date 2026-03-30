mod utils;
use wasm_bindgen::prelude::*;
use sha2::{Sha256, Digest};
use serde::{Serialize};

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, hashing_fb!");
}

#[derive(Serialize)]
pub struct HashedWord {
    word: String,
    hash: String,
}


#[wasm_bindgen]
pub fn hash_passwords(text: &str) -> JsValue {
    let mut results = Vec::new();
    for words in text.split_whitespace() {
        let mut hasher = Sha256::new();
        hasher.update(words.as_bytes());
        let hash = format!("{:x}", hasher.finalize());
        results.push(HashedWord{
            word: words.to_string(),
            hash,
        });
    }
    serde_wasm_bindgen::to_value(&results).unwrap()
}