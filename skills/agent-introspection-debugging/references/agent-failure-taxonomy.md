# Agent Failure Taxonomy

Classify the earliest confirmed divergence, not the loudest downstream symptom. Assign one primary category and record contributing categories separately.

| Category | Diagnostic question | Strong evidence | Typical owner |
|---|---|---|---|
| Outcome contract | Was success, refusal, escalation, or termination defined ambiguously? | Different reasonable interpretations of the same acceptance criteria | Product specification or orchestrator |
| Instructions | Did applicable instructions conflict, omit a required rule, or encourage the wrong priority? | The observed action follows an ambiguous or conflicting instruction | Prompt or policy owner |
| Context and state | Was required state missing, stale, truncated, duplicated, or placed at the wrong scope? | The decision changes when the missing or corrected context is supplied | Context assembly layer |
| Model output contract | Did the model violate a required schema, type, or response protocol? | Raw output is invalid before downstream parsing | Model integration layer |
| Retrieval | Did retrieval miss, rank poorly, expose unauthorized content, or return stale evidence? | The needed source is absent or unsupported content is retrieved | Retrieval pipeline |
| Tool contract | Was the tool name, description, schema, or error contract misleading? | A valid-looking model request maps to an ambiguous or incomplete interface | Tool designer |
| Tool invocation | Did the agent choose the wrong tool, arguments, order, or retry behavior? | The trace contains an unjustified call despite a usable contract and context | Agent policy or routing layer |
| Tool runtime | Did the tool fail, time out, mutate partially, or return malformed data? | The request is valid but execution evidence shows a runtime failure | Tool implementation or dependency |
| Authorization and guardrails | Was a safe action blocked, a risky action allowed, or approval applied at the wrong boundary? | A policy decision contradicts the defined authority contract | Guardrail or authorization layer |
| Routing and handoff | Was work sent to the wrong role, missing required state, or returned without a usable contract? | The receiving agent lacks inputs or owns the wrong decision | Orchestrator |
| Loop and termination | Did retries, planning, or tool use lack a budget, progress test, or stop condition? | Repeated states occur without new evidence or the run stops before acceptance | Orchestrator or runtime policy |
| Synthesis and grounding | Did the final response contradict tool evidence, omit uncertainty, or combine incompatible results? | Earlier trace evidence is correct but the final synthesis is not | Final-response layer |
| Evaluation | Did the system optimize for an incomplete grader or miss a critical case? | The run passes the configured gate while violating the product outcome | Eval design owner |

## Classification Rules

1. Identify the first trace event that could have changed the final outcome.
2. Compare that event with the information and authority available at that exact time.
3. Assign the category whose owner can prevent recurrence with the smallest justified change.
4. Record downstream symptoms without recategorizing them as independent root causes.
5. Mark the result `unconfirmed` when missing traces or nondeterminism prevent causal attribution.

## Confidence Scale

- **High**: Reproduction and a discriminating experiment confirm the causal mechanism.
- **Medium**: Multiple trace facts support one explanation, but a decisive experiment is unavailable.
- **Low**: The category is plausible but relies on missing events, inferred state, or a single ambiguous run.
