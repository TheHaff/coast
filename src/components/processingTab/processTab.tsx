import { motion } from "framer-motion";
import { useAtom } from "jotai";

import {
  stepProgressionEffect,
  substepVisibilityEffect,
  useProcessState,
} from "../../state/useProcessState";
import GraphView from "../graph/graph";
import Step from "../step/step";
import TimeSlider from "../timeSlider/timeSlider";

export default function ProcessTab() {
  const { completedSteps, currentIndex, isPlaying, setIsPlaying, steps } =
    useProcessState();

  // Register both effects
  useAtom(substepVisibilityEffect);
  useAtom(stepProgressionEffect);

  const allStepsCompleted = completedSteps === steps.length;
  const stepsToShow = steps.slice(0, currentIndex + 1);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Processing Steps</h2>
      <button
        className="btn mb-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        data-testid="play-pause-button"
        onClick={() => {
          setIsPlaying((prev) => !prev);
        }}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <TimeSlider total={steps.length} />
      <div className="flex flex-row gap-4">
        <div className="w-2/3 space-y-4 perspective-1000">
          {stepsToShow.map((step, i) => (
            <motion.div
              animate={{
                filter: "blur(0px)",
                opacity: 1,
                rotateX: 0,
                y: 0,
                z: 0,
              }}
              initial={{
                filter: "blur(4px)",
                opacity: 0,
                rotateX: 15,
                y: -50,
                z: -50,
              }}
              key={i}
              style={{ transformStyle: "preserve-3d" }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <Step index={i} step={step} />
            </motion.div>
          ))}
        </div>
        <div className="w-1/3">
          <GraphView  />
        </div>
      </div>
      <footer>
        {allStepsCompleted ? (
          <span
            className="text-sm text-gray-500"
            data-testid="all-steps-completed"
          >
            All steps completed ✅
          </span>
        ) : null}
      </footer>
    </div>
  );
}
