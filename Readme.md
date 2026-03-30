Refleksioner over Rust hashing-algoritme vs Javascript hashing.


Vi laver mange små kald fra js til rust og derfor må det tage længere tid end hvis det var en stor fil i rust, som blev hashet.
Hvis man samlede det hele og sendte til wasm, ville det nok gå endnu hurtigere.
Ved at bruge wasm er der en masse ekstra arbejde, blandt andet konvertering fra js til wasm og derfor skal datamængden være stor for at det kan betale sig...

| Metode (188300 ord) | Tid        | Fordel                        |
|---------------------|------------|-------------------------------|
| Rust / WASM         | ~691.5 ms  | Hurtigere ved store datamængder |
| JavaScript          | ~2953.3 ms | Ingen overhead ved små kald   |

Til små opgaver med omkring 10 ord, var javascript hurtigere. Så hvis det bare er til et login, vil js være hurtigere.


https://github.com/SpeedosDK/hashing_fb