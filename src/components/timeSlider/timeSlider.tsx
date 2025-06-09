import { useProcessState, useStepSelection } from "../../state/useProcessState";

export default function TimeSlider() {
  const { currentIndex, steps } = useProcessState();
  const handleStepSelection = useStepSelection();
  const total = steps.length;

  return (
    <div className="mt-4">
      <input
        className="w-full"
        max={total}
        min={0}
        onChange={(e) => handleStepSelection(Number(e.target.value))}
        type="range"
        value={currentIndex}
      />
      <p className="text-sm text-center text-gray-500 mt-2 mb-4">
        Step {currentIndex} of {total}
      </p>
    </div>
  );
}
