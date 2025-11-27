---
title: "Verification Research Testbed & Dataset"
number: "030"
author: "Amodo"
state: "idea"
tags: ["verification", "infrastructure", "side-channel"]
created: "2024-11-27"
---

## The Idea

Create shared infrastructure for verification research: (1) a research dataset of side-channel signals from AI workloads, and (2) documentation/guides for setting up verification research servers. Lower the barrier for academics and other researchers to enter the field.

## Why It Matters

Verification research is bottlenecked by access to hardware and know-how. Few researchers have H100s with oscilloscopes attached. Publishing datasets and setup guides accelerates the whole field.

## Implementation Status (Amodo)

**Dataset collection (planned):**
- Power side-channel recordings
- EM side-channel recordings
- Network packet captures
- Correlated with known workload labels (training, inference, model size, etc.)
- Focus on approaches with feasible real-world uptake

**Documentation (in progress):**
- DOCA explainers and primers
- 101 on "research servers" compatible with Confidential Computing
- Cost-effective setups: which SKUs, which tradeoffs
- CC on A100s: OS options, BIOS config, switch setup
- "From bare metal to 70B model" for research setups
- SEV-SNP configuration guides

**Hardware for dataset collection:**
- GPUs, servers, side-channel measurement equipment
- Budget: ~£200k materials

## Outputs Planned

- Public dataset for verification researchers
- Analysis and publication of findings
- Open documentation on research server setup

## Open Questions

- What workloads should be in the dataset? (training, inference, fine-tuning, different model sizes)
- What side-channels are most informative? (power, EM, network, timing)
- How to make dataset useful across different hardware generations?
- Governance of dataset access (open? restricted?)

## References

- Related: RFD 027 (Training vs Inference Discrimination) — uses this infrastructure
- Related: RFD 012 (Analog Sensors for Compute Verification)
- Gabriel Kulp's side-channel work (RFDs 001-004)
