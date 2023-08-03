import React, { useRef, useEffect, useState } from "react";
import { sample_node_6, sample_node_18, sample_node_finale } from "../static/samples";
import {
  addNewSphere,
  handleResize,
  showUploadField,
  spheres3,
  enableTable,
  clearScene,
  drawArrows,
} from "../static/script";
import { renderer, camera, controls, scene } from "../static/init";

function Graph() {
  const canvasRef = useRef(null);
  const [spheres, setSpheres] = useState([["A"], ["B"], ["C"]]);
  const [unique, setUnique] = useState([]);
  const [indicies, setIndicies] = useState({});
  const [connections, setConnections] = useState([
    [0, 1],
    [1, 2],
    [2,0]
  ]);
  const [textareaValue, setTextareaValue] = useState(
    "- Useful for modeling complex relationships between data.\r- Modeling social networks, transportation systems, etc.\r- Can be challenging to implement, but provide a lot of flexibility and power."
  );
  let spheresLoad = false;
  const [isShrunk, setIsShrunk] = useState(false);
  const shrinkDiv = () => {
    setIsShrunk(!isShrunk);
  };

  const callSpheres = () => {
    if (!spheresLoad) {
      let x = 0;
      let y = 0;
      let counter = 0;
      let counter_2 = 0;
      let counter_3 = 0;
      let x_val = 0;
      

      spheres.forEach((sphere, i) => {
        addNewSphere(scene, sphere, sphere, x, y);
        x += 2;
        counter += 1;
        if (counter == 2) {
          y -= 1;
          counter = 0;
          counter_2 += 1;
        }
        if (counter_2 == 2) {
          counter_2 = 0;
          x = x_val;
          x_val += 1;
          counter_3 += 1;
        }
        if (counter_3 == 2) {
          counter_3 = -100;
          x = 1;
          y = 5;
        }
      });
      for (let connection in connections) {
        if (
          connections[connection].length === 2 &&
          typeof connections[connection][0] === "number" &&
          typeof connections[connection][1] === "number"
        ) {
          drawArrows(scene, spheres3, [
            connections[connection][0],
            connections[connection][1],
          ]);
        } else {
          console.log("Invalid connection: " + connections[connection]);
        }
      }
      spheresLoad = true;
    }
  };

  useEffect(() => {
    callSpheres();
  }, [spheres]);

  useEffect(() => {
    if (document.getElementById("about").innerHTML === "Dataset:") {
      let split = textareaValue.split("\n");
      console.log(split);

      for (let row in split) {
        split[row] = split[row].split(",");
      }

      let return_array = [split];
      let unique_vals = [];
      let indices_dict = {};

      for (let row in split) {
        console.log("row: " + split[row]);

        for (let col in split[row]) {
          console.log("col: " + split[row][col]);
          if (split[row][col] === "") {
            continue; // skip the iteration if the value is an empty string
          }
          if (!(split[row][col] in indices_dict)) {
            // code to execute if key is not present in the object
            unique_vals.push(split[row][col]);
            indices_dict[split[row][col]] = unique_vals.length - 1;
          }
        }
      }

      console.log("unique", unique_vals);
      console.log("indices", indices_dict);

      let connections_index = split.map((connection) =>
        connection.map((node) => indices_dict[node])
      );
      clearScene(scene, spheres3);
      setSpheres(unique_vals);
      setUnique(unique_vals);
      setIndicies(indices_dict);
      setConnections(connections_index);
    }
  }, [textareaValue]);

  useEffect(() => {
    canvasRef.current.appendChild(renderer.domElement);
    callSpheres();

    window.addEventListener("resize", () => handleResize(camera, renderer));

    window.onload = () => {
      var reader = new FileReader(),
        picker = document.getElementById("csvfile"),
        table = document.getElementById("table");
      let title = document.getElementById("about");
      picker.onchange = () => reader.readAsText(picker.files[0]);
      reader.onloadend = () => {
        let csv_data = reader.result;
        setTextareaValue(csv_data);
        title.value = "Dataset:";
      };
    };
  }, []);

  const animate = () => {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
    for (let i = 0; i < spheres3.length; i++) {
      spheres3[i].rotation.y += 0.003;
    }
  };

  animate();

  return (
    <div ref={canvasRef} id="canvas">
            <div id="main" className={`main${isShrunk ? ' shrunk' : ''}`}>
        <form action="/array" method="post" className={`m-1 ${isShrunk ? 'hidden' : ''}`}>
          <h1 id="title" className="m-1">
            Graph
          </h1>
          <div id="dataDiv" style={{ display: "block" }}>
            <div className="m-1">
              <label htmlFor="table" id="about">
                About Me:
              </label>
            </div>
            <textarea
              type="text"
              id="table"
              disabled
              name="table"
              className="m-1"
              rows="4"
              cols="35"
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
            ></textarea>
          </div>

          <div>
            <button
              id="csvButton"
              className="btn btn-outline-secondary dropdown-toggle m-1"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              onClick={() => {
                document.getElementById("about").innerHTML = "Dataset:";
                enableTable();
              }}
            >
              Select Dataset
            </button>
            <ul className="dropdown-menu">
              <li>
                <a
                  id="csv_file"
                  className="dropdown-item"
                  href="#"
                  onClick={() => {
                    setTextareaValue(sample_node_6);
                  }}
                >
                  sample_node_6
                </a>
              </li>
              <li>
                <a
                  id="csv_file"
                  className="dropdown-item"
                  href="#"
                  onClick={() => {
                    setTextareaValue(sample_node_18);
                  }}
                >
                  sample_node_18
                </a>
              </li>
              <li>
                <a
                  id="csv_file"
                  className="dropdown-item"
                  href="#"
                  onClick={() => {
                    setTextareaValue(sample_node_finale);
                  }}
                >
                  sample_node_finale
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={() => {
                    showUploadField();
                  }}
                >
                  Upload .csv
                </a>
              </li>
            </ul>
          </div>
          <div id="uploadDiv" style={{ display: "none" }}>
            <input
              type="file"
              accept=".csv"
              id="csvfile"
              className="m-1"
              onClick={() => enableGoButton()}
            />
          </div>
        </form>
        <div className={`shrink-button${isShrunk ? ' shrunk' : ''}`} onClick={shrinkDiv}>
          X
        </div>
      </div>
    </div>
  );
}

export default Graph;
