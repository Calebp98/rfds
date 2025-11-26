---
title: "Zero-Maintenance Compute for Tamper Evidence"
number: "009"
author: "James Petrie"
state: "discussing"
tags: ["verification", "hardware", "reliability", "tamper-evidence"]
created: "2024-11-26"
---

## The Idea

Lock compute in a tamper-evident enclosure and never open it. This requires clusters that can operate without physical maintenance—using overprovisioning, redundant components, conservative thermal/power settings, and fault-tolerant distributed algorithms.

If you can credibly commit to "this enclosure hasn't been opened since installation," many tampering attacks become impossible. The question is whether current hardware reliability makes this practical, and what the cost premium is for sufficient redundancy.

## Why It Matters

Physical access is the root of most hardware attacks. Eliminating maintenance access eliminates a large class of tampering opportunities. Even if zero-maintenance isn't fully achievable, understanding the reliability frontier helps design minimal-access protocols.

## Open Questions

- What's the expected MTBF for a redundant GPU cluster?
- How much overprovisioning is needed for multi-year operation?
- Can fault-tolerant AllReduce (arxiv:2510.20171) make training robust to node failures?

## References

- [AI hardware survival modeling](https://docs.google.com/document/d/1-BEvc4fY-ZXZLchPiigsN1mdK33YmxAFjSbxanoXvOE/edit)
- [Fault tolerant AllReduce](https://arxiv.org/pdf/2510.20171)
