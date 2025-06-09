export type Step = {
  substeps: Substep[];
  title: string;
};

export type Substep = {
  key: string;
  value: string;
};

export const fakeData: { steps: Step[] } = {
  steps: [
    {
      substeps: [
        {
          key: "Sanitize Inputs",
          value: "Completed",
        },
      ],
      title: "Validate User Inputs",
    },
    {
      substeps: [
        {
          key: "Flags Detected",
          value: "8",
        },
        {
          key: "Calculate overall Risk",
          value: "High",
        },
      ],
      title: "Screen against sanctions and PEP Lists",
    },
    {
      substeps: [
        {
          key: "E string",
          value: "Tuned",
        },
        {
          key: "A string",
          value: "Tuned",
        },
        {
          key: "D string",
          value: "Broken 🥲",
        },
        
      ],
      title: "Tune guitar",
    },
    {
      substeps: [
        { key: "Preheat pan", value: "Success" },
        { key: "Add bacon", value: "Sizzling" },
        { key: "Flip bacon", value: "Sizzling" },
        { key: "Inspect crisp level", value: "Crunchy" },
        { key: "Serve bacon", value: "Success" },
      ],
      title: "Fry Bacon 🥓",
    },
  ],
};

export const fetchProcesses = () => fakeData;
