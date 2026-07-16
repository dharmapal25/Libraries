import { useRef, useState } from "react";
import { Stage, Layer, Circle, Rect } from "react-konva";

export default function App() {
  const stageRef = useRef();

  const [tool, setTool] = useState("circle");
  const [shapes, setShapes] = useState([]);
  const [current, setCurrent] = useState(null);
  const [drawing, setDrawing] = useState(false);

  function getMouse() {
    return stageRef.current.getPointerPosition(); // stage inside the cursor position {x,y}
  }

  function handleMouseDown() {
    if (tool === "select") return;

    const pos = getMouse();
    setDrawing(true);

    if (tool === "circle") {
      setCurrent({
        type: "circle",
        x: pos.x,
        y: pos.y,
        radius: 0,
      });
    }

    if (tool === "rect") {
      setCurrent({
        type: "rect",
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
      });
    }
  }

  function handleMouseMove() {
    if (!drawing || !current) return;

    const pos = getMouse();

    if (current.type === "circle") {
      const dx = pos.x - current.x;
      const dy = pos.y - current.y;

      const radius = Math.sqrt(dx * dx + dy * dy);

      setCurrent({
        ...current,
        radius,
      });
    }

    if (current.type === "rect") {
      setCurrent({
        ...current,
        width: pos.x - current.x,
        height: pos.y - current.y,
      });
    }
  }

  function handleMouseUp() {
    if (!drawing) return;

    setShapes([...shapes, current]);

    setCurrent(null);

    setDrawing(false);
  }

  return (
    <>
      <div style={{ display: "flex", gap: 10, padding: 10 }}>
        <button onClick={() => setTool("circle")}>Circle</button>
        <button onClick={() => setTool("rect")}>Rectangle</button>
        <button onClick={() => setTool("select")}>Select</button>
      </div>

      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ background: "#ddd" }}
      >
        <Layer>
          {shapes.map((shape, index) => {
            if (shape.type === "circle") {
              return (
                <Circle
                  key={index}
                  {...shape}
                  stroke="black"
                  draggable={tool === "select"}
                />
              );
            }

            if (shape.type === "rect") {
              return (
                <Rect
                  key={index}
                  {...shape}
                  stroke="blue"
                  draggable={tool === "select"}
                />
              );
            }

            return null;
          })}

          {current &&
            (current.type === "circle" ? (
              <Circle
                {...current}
                stroke="red"
              />
            ) : (
              <Rect
                {...current}
                stroke="red"
              />
            ))}
        </Layer>
      </Stage>
    </>
  );
}