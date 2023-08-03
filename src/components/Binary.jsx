import React, { useRef, useEffect, useState } from "react";
import { sample_binary_3, sample_binary_4, sample_binary_5 } from "../static/samples";
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

function Binary() {
  const canvasRef = useRef(null);
  const [spheres, setSpheres] = useState([["A"],["B"],["C"]]);
  const [unique, setUnique] = useState([]);
  const [indicies, setIndicies] = useState({});
  const [connections, setConnections] = useState([[0,1],[0,2]]);
  const [textareaValue, setTextareaValue] = useState(
    "- Useful for hierarchical data structures.\n- Efficient searching and sorting.\n- More complex to implement than some other data structures."
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
      let holder = Math.ceil(Math.sqrt(spheres.length));
      let level = holder / 2;
      let left_corner = -holder;
      let right_corner = holder;
      let inital_node = true;

      spheres.forEach((sphere, i) => {
        addNewSphere(scene, sphere, sphere, x, y);
        x += holder * 2;
        if (inital_node == true) {
          x = left_corner;
          y -= 2;
          inital_node = false;
        } else if (x > right_corner) {
          holder = holder / 2;
          left_corner = left_corner - level;
          right_corner = right_corner + level;
          level = level / 2;
          x = left_corner;
          y -= 2;
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
        spheres3[i].rotation.y += .003;
    }
  };

  animate();

  return (
    <div ref={canvasRef} id="canvas">
       <div id="main" className={`main${isShrunk ? ' shrunk' : ''}`}>
        <form action="/array" method="post" className={`m-1 ${isShrunk ? 'hidden' : ''}`} >
          <h1 id="title" className="m-1">
            Binary Tree
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
                    setTextareaValue(sample_binary_3);
                  }}
                >
                  sample_binary_3
                </a>
              </li>
              <li>
                <a
                  id="csv_file"
                  className="dropdown-item"
                  href="#"
                  onClick={() => {
                    setTextareaValue(sample_binary_4);
                  }}
                >
                  sample_binary_4
                </a>
              </li>
              <li>
                <a
                  id="csv_file"
                  className="dropdown-item"
                  href="#"
                  onClick={() => {
                    setTextareaValue(sample_binary_5);
                  }}
                >
                  sample_binary_5
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

export default Binary;
