# React + TypeScript + Vite + goya(ブラウザのみで形態素解析)

goya -> https://github.com/Leko/goya?tab=readme-ov-file

Goya は Rust で書かれた日本語の形態素解析ツールです。
主な目標は、ブラウザやその他のJavaScriptランタイムで形態素解析を行うためにWebAssemblyにコンパイルすることです。さらに、CLI やRustでも使用できます。

react環境を作成

```bash
npm create vite@latest
cd vite-project
npm i goya-core goya-features
```

wasmをpublicにコピーする

```bash
cp /home/hdys/goya-app/node_modules/goya-core/web/goya_core_bg.wasm ./public \
&& cp /home/hdys/goya-app/node_modules/goya-features/web/goya_features_bg.wasm ./public
```

App.tsx

```js
import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import goya_core, { parse } from "goya-core/web/goya_core"; //インポート
import goya_features, { get_features } from "goya-features/web/goya_features"; //インポート

function App() {
  const [text, setText] = useState("")
  const [goya, setGoya] = useState([[]])
  useEffect(() => {
    WebAssembly.compileStreaming(fetch("goya_core_bg.wasm")).then((mod) => //静的アセットから読み込み
      goya_core(mod) //初期化
    );
    WebAssembly.compileStreaming(fetch("goya_features_bg.wasm")).then((mod) => //静的アセットから読み込み
      goya_features(mod) //初期化
    );
  }, [])

  const handleOnChenge = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    if (e.target.value === "") {
      setGoya([[]])
      return
    }
    // 形態素解析
    const lattice = parse(e.target.value);
    const morphemes = lattice.find_best();
    const features = get_features(morphemes.map((morph) => morph.wid));

    const result = new Array();
    morphemes.forEach(({ surface_form }, i) => {
      const feature = features[i];
      feature.unshift(surface_form)
      result.push(feature)
    });
    setGoya(result)
  }

  ...

```