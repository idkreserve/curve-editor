import "normalize.css"
import "./App.css"
import Point from "./components/Point"
import PathLine from "./components/PathLine"
import { useState } from "react"
import { v4 } from "uuid"

function App() {
  const [points, setPoints] = useState({});

  const generatePath = () => {
    if (points.length < 2) {
      return "";
    }

    let prev = "";
    return Object.values(points).reduce((acc, point, index) => {
      if (index == 0) {
        acc += `M ${point.x} ${point.y}`
      } else {
        acc += ` C ${prev} ${point.x} ${point.y}, ${point.x} ${point.y}`;
      }

      prev = `${point.x} ${point.y}`;
      return acc;
    }, "");
  };

  const handleAddPoint = event => {
    event.preventDefault();
    const index = v4();

    setPoints(prev => ({
      ...prev,
      [index]: { x: event.clientX, y: event.clientY },
    }));
  };

  const handleRemovePoint = index => {
    setPoints(prev => {
      const newPoints = { ...prev };
      delete newPoints[index];
      return newPoints;
    });
  };

  const handleMovePoint = (event, index) => {
    const offsetX = event.clientX - points[index].x;
    const offsetY = event.clientY - points[index].y;

    const handleMouseMove = (moveEvent) => {
      const newPoints = { ...points };
      newPoints[index] = {
        x: moveEvent.clientX - offsetX,
        y: moveEvent.clientY - offsetY,
      };
      setPoints(newPoints);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <svg onContextMenu={handleAddPoint} id="app-editor">
      <PathLine
        d={generatePath()}
      />
      {Object.entries(points).map(([index, coords]) => (
        <Point
          key={index}
          onMouseDown={e => handleMovePoint(e, index)}
          onDoubleClick={() => handleRemovePoint(index)}
          x={coords.x} y={coords.y}
        />
      ))}
    </svg>
  )
}

export default App
