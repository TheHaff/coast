import classNames from "classnames";
import { motion } from "framer-motion";

import type { Step } from "../../state/fakeApi";

import { useProcessState } from "../../state/useProcessState";

type SubstepProps = {
  label: string;
  value: string;
};

const Substep = ({ label, value }: SubstepProps) => {
  return (
    <motion.li
      animate={{ opacity: 1, x: 0 }}
      className="text-black font-mono flex justify-between bg-gray-100 p-2 rounded"
      initial={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.5 }}
    >
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm text-gray-600">{value}</span>
    </motion.li>
  );
};

type Props = {
  index: number;
  step: Step;
};

export default function StepItem({ index, step }: Props) {
  const {
    currentIndex,
    isStepCompleted,
    visibleSubsteps,
  } = useProcessState();

  const isActive = currentIndex === index;
  const isCompleted = isStepCompleted(index);
  const visibleCount = isActive ? (visibleSubsteps[currentIndex] ?? 0) : step.substeps.length;
  const substepsToShow = step.substeps.slice(0, visibleCount);

  return (
    <div
      className={classNames("mb-4 p-3 rounded border text-black font-mono", {
        "border-blue-500 bg-blue-50": isActive,
        "border-gray-200 bg-white": !isActive,
      })}
    >
      <header className="flex justify-between items-center">
        <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
        {isCompleted && <div>✅</div>}
      </header>
      <ul className="space-y-1">
        {substepsToShow.map((substep) => (
          <Substep
            key={substep.key}
            label={substep.key}
            value={substep.value}
          />
        ))}
      </ul>
    </div>
  );
}
