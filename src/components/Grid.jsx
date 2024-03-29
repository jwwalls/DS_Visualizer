import React, { useRef, useEffect, useState } from "react";
import { sample_2d_5, sample_2d_10, sample_2d_15 } from "../static/samples";
import {
  addNewCube,
  handleResize,
  showUploadField,
  cubes3,
  enableTable,
  clearScene,
} from "../static/script";
import { renderer,  camera, controls, scene } from "../static/init";
import * as THREE from "three";

function Grid() {
  const canvasRef = useRef(null);
  
  const [cubes, setCubes] = useState(["12","34"]);
  const [textareaValue, setTextareaValue] = useState(
    "- Useful for two-dimensional data organization.\r- Fixed size can limit flexibility.\r- Accessing elements can be more complex than one-dimensional structures."
  );
  const [isShrunk, setIsShrunk] = useState(false);
  const shrinkDiv = () => {
    setIsShrunk(!isShrunk);
  };
  let mouseDown = false;
  let selectedCube = null;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let cubesLoad = false;
  let y_value = 0;
  let x_value = 0;

  const callCubes = () => {    
    if (!cubesLoad) {
      cubes.forEach((cube, i) => {
       
        for (let i = 0; i < cube.length; i++) {
            addNewCube(scene, `[${x_value}][${i}]`, cube[i], i, y_value);
        }
        x_value += 1;
        y_value += -2;
      });
      cubesLoad = true;
    }
  };

  useEffect(() => {
    callCubes();
    
  }, [cubes]);

  useEffect(() => {
    if (document.getElementById("about").innerHTML === "Dataset:") {
      let split = textareaValue.split("\n");      
      
      for(let i = 0; i < split.length; i++) {
        split[i] = split[i].split(",");
      }
      
      setCubes(split);      
      clearScene(scene,cubes3);
    }
  }, [textareaValue]);

  
  useEffect(() => {    
    
    canvasRef.current.appendChild(renderer.domElement);
    callCubes();

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
    // Mousedown Raycaster to select cube
    renderer.domElement.addEventListener("mousedown", (event) => {
      mouseDown = true;
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      // Filter out non-cube objects
      const cubesI = scene.children.filter((obj) => obj.userData.isCube);
      const intersects = raycaster.intersectObjects(cubesI, true);
      if (intersects.length > 0) {
        selectedCube = intersects[0].object.parent;
      }
    });

    // Spin the cubes
    renderer.domElement.addEventListener("mousemove", (event) => {
      if (mouseDown && selectedCube !== null) {
        const deltaX = event.clientX - lastMouseX;
        const deltaY = event.clientY - lastMouseY;
        const deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(
            deltaY * (Math.PI / 180),
            deltaX * (Math.PI / 180),
            0,
            "XYZ"
          )
        );
        selectedCube.quaternion.multiplyQuaternions(
          deltaRotationQuaternion,
          selectedCube.quaternion
        );
      }
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
    });

    // Deselect Cube
    renderer.domElement.addEventListener("mouseup", () => {
      mouseDown = false;
      selectedCube = null;
    });
  }, []);

  const animate = () => {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();

  return (
    <div ref={canvasRef} id="canvas">
            <div id="main" className={`main${isShrunk ? ' shrunk' : ''}`}>
        <form action="/array" method="post" className={`m-1 ${isShrunk ? 'hidden' : ''}`}>
          <h1 id="title" className="m-1">
            2D-Grid
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
            >
              
            </textarea>
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
                    setTextareaValue(sample_2d_5);
                  }}
                >
                  sample_2d_5
                </a>
              </li>
              <li>
                <a
                  id="csv_file"
                  className="dropdown-item"
                  href="#"
                  onClick={() => {
                    setTextareaValue(sample_2d_10);
                  }}
                >
                  sample_2d_10
                </a>
              </li>
              <li>
                <a
                  id="csv_file"
                  className="dropdown-item"
                  href="#"
                  onClick={() => {
                    setTextareaValue(sample_2d_15);
                  }}
                >
                  sample_2d_15
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

export default Grid;
