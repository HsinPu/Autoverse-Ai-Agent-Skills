# Three.js Character and Spatial Systems

Use this reference when animation, procedural morphology, inverse kinematics, navigation, crowds, and physics affect the same character.

## Authority Order

Declare one writer for each transform channel and one arbitration order. A common split is:

1. gameplay chooses intent and target;
2. navigation produces a route and desired velocity;
3. character control or physics resolves movement and contacts;
4. animation selects clips and computes a pose;
5. IK adjusts bounded end effectors from verified contacts;
6. rendering interpolates authoritative state.

Do not copy transforms bidirectionally between these layers each frame.

## Skeleton and Retarget Contract

Record:

- bone names and semantic map;
- hierarchy, rest pose, bind matrices, and handedness;
- root-motion source and scale;
- joint limits and twist axes;
- expected missing or extra bones;
- morph-target identity and ordering;
- attachment sockets;
- retarget corrections and reference poses.

Validate the contract on extreme poses and at least one loop transition. A clip that plays without exceptions can still have incorrect scale, hips, feet, shoulders, or twist.

## IK and Contact

- Use IK for a bounded correction, not as an unexplained replacement for locomotion.
- Define solver iterations, tolerances, pole or bend direction, reach limits, and fallback pose.
- Filter contact targets but reset state after teleport, origin shift, rig swap, or discontinuity.
- Decide whether feet, hands, gaze, weapons, and mounted equipment are animation-, IK-, or physics-owned in each state.

## Navigation and Crowds

- Version nav data with level geometry and agent profile.
- Keep global pathfinding, local avoidance, and collision response distinct.
- Identify unreachable goals and partial paths explicitly.
- Bound replanning, neighbor queries, and worker queues.
- Preserve request generations so stale worker results cannot move a respawned or reassigned agent.

## Validation

Use seed, route, pose, obstacle, frame-rate, and crowd-density sweeps. Capture authority conflicts, foot sliding, penetrations, oscillation, path churn, retarget drift, and CPU cost.
