---
title: "Secure Enclosure (SCIF) for AI Clusters"
number: "006"
author: "James Petrie"
state: "discussing"
tags: ["verification", "hardware", "physical-security", "scif"]
created: "2024-11-26"
---

## The Idea

Use a commercial-off-the-shelf Sensitive Compartmented Information Facility (SCIF) to physically contain an AI cluster. The enclosure must hold 8–384 GPUs (enough for frontier model inference), support liquid cooling pass-through, and be trusted by datacenter operators not to leak weights while also trusted by regulators/governments to prevent secret communication channels.

For international verification, the trust problem is harder: can another country trust a SCIF set up by the datacenter operator? Can the operator trust a foreign inspector's SCIF not to contain exfiltration malware? A two-layer SCIF design (one from each party) might reduce bilateral trust requirements.

## Why It Matters

Physical containment is a forcing function for other verification mechanisms. If you can credibly claim "nothing leaves this box except through the monitored network tap," many software-level attacks become irrelevant. SCIFs are already a mature technology for classified information—the question is whether they can be adapted for AI compute.

## Open Questions

- What's the right enclosure size / GPU count for initial deployment?
- How to handle maintenance? Can clusters be made robust enough to avoid physical access (redundant components, conservative settings)?
- How would two-party SCIF inspection work in practice?

## References

- [AI hardware survival modeling](https://docs.google.com/document/d/1-BEvc4fY-ZXZLchPiigsN1mdK33YmxAFjSbxanoXvOE/edit)
