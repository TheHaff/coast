import type { Getter, Setter } from "jotai";

import { atom, useAtom } from "jotai";
import { atomEffect } from "jotai-effect";

import type { Step } from "./fakeApi";

import { fetchProcesses } from "./fakeApi";

export const stepsAtom = atom<Step[]>([]);
export const currentProcessIndexAtom = atom(0);
export const isPlayingAtom = atom(false);
export const completedStepsAtom = atom(0);
export const visibleSubstepsAtom = atom<Record<number, number>>({});

// Effect to handle substep visibility animation
export const substepVisibilityEffect = atomEffect(
  (get: Getter, set: Setter) => {
    const isPlaying = get(isPlayingAtom);

    if (!isPlaying) {
      return;
    }

    const interval = setInterval(() => {
      const currentIndex = get(currentProcessIndexAtom);
      const completedSteps = get(completedStepsAtom);
      const steps = get(stepsAtom);
      const isLastStep = currentIndex === steps.length - 1;

      // Only animate substeps for the current process
      if (currentIndex !== completedSteps) {
        return;
      }

      set(visibleSubstepsAtom, (prev: Record<number, number>) => {
        const currentCount = prev[currentIndex] ?? 0;
        const newState = {
          ...prev,
          [currentIndex]: currentCount + 1,
        };

        // If we're on the last step and all substeps are now visible, clear the interval
        if (
          isLastStep &&
          newState[currentIndex] === steps[currentIndex].substeps.length
        ) {
          clearInterval(interval);
        }

        return newState;
      });
    }, 500);

    return () => clearInterval(interval);
  }
);

// Effect to handle step progression when substeps are completed
export const stepProgressionEffect = atomEffect((get: Getter, set: Setter) => {
  const steps = get(stepsAtom);
  const currentIndex = get(currentProcessIndexAtom);
  const isPlaying = get(isPlayingAtom);
  const visibleSubsteps = get(visibleSubstepsAtom);
  const completedSteps = get(completedStepsAtom);

  // Only check progression for the current process
  if (!isPlaying || currentIndex !== completedSteps) {
    return;
  }

  const currentStep = steps[currentIndex];
  if (!currentStep) return;

  const visibleCount = visibleSubsteps[currentIndex] || 0;
  const isLastStep = currentIndex === steps.length - 1;

  // Only progress if we have shown all substeps
  if (visibleCount === currentStep.substeps.length) {
    if (!isLastStep) {
      // Mark current step as completed and move to next
      set(completedStepsAtom, currentIndex + 1);
      set(currentProcessIndexAtom, currentIndex + 1);
      // Initialize visible substeps for the next step
      set(visibleSubstepsAtom, (prev: Record<number, number>) => ({
        ...prev,
        [currentIndex + 1]: 0,
      }));
    } else {
      // For last step, just stop playing
      set(completedStepsAtom, currentIndex + 1);
      set(currentProcessIndexAtom, currentIndex + 1);
      set(isPlayingAtom, false);
    }
  }
});

// Derived atom to check if a step is completed
export const stepCompletionAtom = atom((get) => {
  const completedSteps = get(completedStepsAtom);
  return (stepIndex: number) => completedSteps > stepIndex;
});

export function useProcessState() {
  const [steps, setSteps] = useAtom(stepsAtom);
  const [currentIndex, setCurrentIndex] = useAtom(currentProcessIndexAtom);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
  const isStepCompleted = useAtom(stepCompletionAtom)[0];
  const [completedSteps, setCompletedSteps] = useAtom(completedStepsAtom);
  const [visibleSubsteps, setVisibleSubsteps] = useAtom(visibleSubstepsAtom);

  // Initialize steps
  if (steps.length === 0) {
    setSteps(fetchProcesses().steps);
  }

  return {
    completedSteps,
    currentIndex,
    isPlaying,
    isStepCompleted,
    setCompletedSteps,
    setCurrentIndex,
    setIsPlaying,
    setVisibleSubsteps,
    steps,
    visibleSubsteps,
  };
}

// Custom hook to handle step selection logic
export function useStepSelection() {
  const [, setCurrentIndex] = useAtom(currentProcessIndexAtom);
  const [, setIsPlaying] = useAtom(isPlayingAtom);
  const [, setVisibleSubsteps] = useAtom(visibleSubstepsAtom);
  const [, setCompletedSteps] = useAtom(completedStepsAtom);

  const handleStepSelection = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
    setVisibleSubsteps((prev: Record<number, number>) => ({
      ...prev,
      [index]: 0,
    }));
    setCompletedSteps(index);
  };

  return handleStepSelection;
}
