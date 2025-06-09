import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createStore, Provider } from "jotai";
import { describe, expect, it, vi } from "vitest";

import {
  completedStepsAtom,
  currentProcessIndexAtom,
  isPlayingAtom,
} from "../../state/useProcessState";
import ProcessTab from "./processTab";

// Mock the fakeApi
vi.mock("../../state/fakeApi", () => ({
  fetchProcesses: () => ({
    steps: [
      { substeps: [{ key: "Substep 1", value: "Value 1" }], title: "Step 1" },
      { substeps: [{ key: "Substep 1", value: "Value 1" }], title: "Step 2" },
    ],
  }),
}));

describe("ProcessTab", () => {
  it("does not show completion message when steps are not done", () => {
    const store = createStore();
    store.set(currentProcessIndexAtom, 0); // at first step
    store.set(completedStepsAtom, 0); // no steps completed
    store.set(isPlayingAtom, false); // not playing

    render(
      <Provider store={store}>
        <ProcessTab />
      </Provider>
    );

    // Check that the completion message is not present
    const completionMessage = screen.queryByTestId("all-steps-completed");
    expect(completionMessage).toBeNull();
  });

  it("shows 'All steps completed' when all steps are done", () => {
    const store = createStore();
    store.set(currentProcessIndexAtom, 2); // index is at the end
    store.set(completedStepsAtom, 2); // all steps completed

    render(
      <Provider store={store}>
        <ProcessTab />
      </Provider>
    );

    const completionMessage = screen.getByTestId("all-steps-completed");
    expect(completionMessage).toBeDefined();
    expect(completionMessage.textContent).toBe("All steps completed ✅");
  });

  it("sets isPlaying to true when play button is clicked", async () => {
    const store = createStore();
    store.set(isPlayingAtom, false);
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <ProcessTab />
      </Provider>
    );

    const playButton = screen.getByRole("button", { name: /play/i });
    await user.click(playButton);

    expect(store.get(isPlayingAtom)).toBe(true);
  });
});
