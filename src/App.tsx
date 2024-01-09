import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import goya_core, { parse } from "goya-core/web/goya_core";
import goya_features, { get_features } from "goya-features/web/goya_features";

function App() {
  const [text, setText] = useState("")
  const [goya, setGoya] = useState([[]])
  useEffect(() => {
    WebAssembly.compileStreaming(fetch("goya_core_bg.wasm")).then((mod) =>
      goya_core(mod)
    );
    WebAssembly.compileStreaming(fetch("goya_features_bg.wasm")).then((mod) =>
      goya_features(mod)
    );
  }, [])

  const handleOnChenge = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    if (e.target.value === "") {
      setGoya([[]])
      return
    }
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

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <br />
        <label htmlFor="text">テキスト入力</label>
        <br />
        <textarea id="text" rows={30} cols={150} value={text} onChange={handleOnChenge} />
        <br />
        <hr />
        <label htmlFor="table">形態素解析結果</label>
        <br />
        <table id="table">
          <thead>
            <tr>
              <th key={"表層形"}>表層形</th>
              <th key={"品詞"}>品詞</th>
              <th key={"品詞細分類1"}>品詞細分類1</th>
              <th key={"品詞細分類2"}>品詞細分類2</th>
              <th key={"品詞細分類3"}>品詞細分類3</th>
              <th key={"活用型"}>活用型</th>
              <th key={"活用形"}>活用形</th>
              <th key={"原形"}>原形</th>
              <th key={"読み"}>読み</th>
              <th key={"発音"}>発音</th>
            </tr>
          </thead>
          <tbody>
            {goya[0] && goya.map((row, i) => {
              return (
                <tr key={i}>
                  {row.map((text, ii) => {
                    return (
                      <td key={ii}>{text}</td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
