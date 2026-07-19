import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Circle, Rect } from "react-konva";

export default function App() {
  const stageRef = useRef();

  const [tool, setTool] = useState("circle");

  // Load shapes from localStorage
  const [shapes, setShapes] = useState(() => {
    const saved = localStorage.getItem("shapes");
    return saved ? JSON.parse(saved) : [];
  });

  const [current, setCurrent] = useState(null);
  const [drawing, setDrawing] = useState(false);

  // Save shapes whenever they change
  useEffect(() => {
    localStorage.setItem("shapes", JSON.stringify(shapes));
  }, [shapes]);

  console.log("shapes",shapes)

  function getMouse() {
    return stageRef.current.getPointerPosition();
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
    if (!drawing || !current) return;

    setShapes((prev) => [...prev, current]);

    setCurrent(null);
    setDrawing(false);
    console.log(shapes)
  }

  function clearCanvas() {
    setShapes([]);
    localStorage.removeItem("shapes");
  }

  console.log("Shapes:", shapes);

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: 10,
          padding: 10,
        }}
      >
        <button onClick={() => setTool("circle")}>
          Circle
        </button>

        <button onClick={() => setTool("rect")}>
          Rectangle
        </button>

        <button onClick={() => setTool("select")}>
          Select
        </button>

        <button onClick={clearCanvas}>
          Clear
        </button>
      </div>

      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          background: "#ddd",
        }}
      >
        <Layer>
          {shapes.map((shape, index) => {
            if (shape.type === "circle") {
              return (
                <Circle
                  fill={"green"}
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