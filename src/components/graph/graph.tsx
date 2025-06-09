import { motion } from "framer-motion";

import { useProcessState, useStepSelection } from "../../state/useProcessState";

export default function GraphView() {
  const { currentIndex, steps } = useProcessState();
  const handleStepSelection = useStepSelection();
  const current = currentIndex;

  const radius = 12;
  const spacing = 100;
  const yStart = 50;

  return (
    <svg className="my-4" height={steps.length * spacing + 50} width="100%">
      <defs>
        <marker
          id="arrow"
          markerHeight="6"
          markerWidth="6"
          orient="auto-start-reverse"
          refX="6"
          refY="5"
          viewBox="0 0 10 10"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#CBD5E1" />
        </marker>
      </defs>

      {steps.map((step, i) => (
        <g key={i}>
          {i < steps.length - 1 && (
            <line
              markerEnd="url(#arrow)"
              stroke="#CBD5E1"
              strokeWidth={2}
              x1={150}
              x2={150}
              y1={yStart + i * spacing}
              y2={yStart + (i + 1) * spacing}
            />
          )}
          <motion.circle
            animate={{ scale: 1 }}
            cx={150}
            cy={yStart + i * spacing}
            fill={
              i < current ? "#22c55e" : i === current ? "#3b82f6" : "#e5e7eb"
            }
            initial={{ scale: 0 }}
            onClick={() => handleStepSelection(i)}
            r={radius}
            transition={{ delay: i * 0.05, stiffness: 300, type: "spring" }}
          />
          <motion.text
            animate={{ opacity: 1, x: 0 }}
            fill="#334155"
            fontSize="14"
            initial={{ opacity: 0, x: 10 }}
            transition={{ delay: i * 0.05 }}
            x={180}
            y={yStart + i * spacing + 5}
          >
            {step.title}
          </motion.text>
        </g>
      ))}
    </svg>
  );
}
