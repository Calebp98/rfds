---
title: "Distributed FLOP Counting"
number: "024"
author: "FlexHEG"
state: "idea"
tags: ["verification", "logging"]
created: "2024-11-27"
---

## The Idea

Count all FLOPs that could have *causally contributed* to an output, across a multi-accelerator workload. Each Interlock maintains a log of (source_id, flop_count) for every accelerator whose data has influenced local computation. Data sent between accelerators includes this log as a prefix, enabling distributed tracking without central coordination.

This prevents "FLOP laundering"—running a large training job across supposedly separate workloads by passing checkpoints through "external data."

## Why It Matters

FLOP thresholds are central to AI regulation (EU AI Act, US diffusion rule, compute governance proposals). Classical accounting (self-reported accelerator counts × time) can be falsified. Hardware-backed FLOP counting with causal tracking makes violations detectable: you can't claim a model took 10²⁵ FLOPs if the hardware logs show 10²⁶ FLOPs contributed to it.

## Protocol

```
1. INITIALIZE
   - Power cycle accelerator (clear RAM)
   - Generate new session_id
   - Set local_flops = 0
   - Initialize flop_log = {self.session_id: 0}

2. ON LOCAL COMPUTATION
   - Increment local_flops
   - Update flop_log[self.session_id] = local_flops

3. ON SEND DATA
   - Attach flop_log as prefix to outgoing data
   - (Encrypt with recipient's session key)

4. ON RECEIVE DATA
   - Parse incoming flop_log
   - For each (source_id, flop_count) in incoming log:
       - If source_id not in local flop_log: add it
       - If flop_count > flop_log[source_id]: update

5. ON EXPORT DATA
   - Sign certificate containing full flop_log
   - Certificate proves: "at most X FLOPs from sources Y contributed to this output"
```

## External Data Handling

External data (training data, user inputs) could smuggle in results from other workloads. Two defenses:

1. **Audited explanation**: Hash external data, auditor attests it's human-generated (spot-check sources)
2. **Mandatory delay**: Data must appear in public record (or auditor log) N months before use. Prevents sequential workload chaining.

Delay for sequential chaining: ~3 months makes 10²⁷ FLOP runs take 30+ months if capped at 10²⁶ per segment.
Delay for parallel coordination: Even seconds of latency significantly hampers distributed training.

## Storage Efficiency

Each source entry: ~30 bytes (1 bit type flag + 16 byte UUID + 12 byte FLOP count, or 32 byte hash for external data)

For 1M sources: ~30MB—trivial compared to GB-scale gradient transfers.

## Handling Streaming

If output is streamed (prefix sent before all computation complete):
1. Include buffer in prefix: "local FLOPs may increase by up to B before stream ends"
2. Halt stream if local FLOPs exceed buffer
3. Stage incoming data until stream completes (can't influence mid-stream)

Buffer adds fixed error, not accumulating error (tracked as max, not sum).

## Combining Outputs

When merging multiple data chunks:
- Logs show overlapping source_ids
- Sum FLOPs without double-counting (take max per source, then sum)
- Can collapse to single total if detailed breakdown not needed

## Open Questions

- How to handle failed/abandoned computation (FLOPs spent but no output)?
- What's the attack surface for falsifying FLOP counts at the source?
- Can workloads be restructured to minimize logged FLOPs while preserving capability?
- How to count FLOPs for novel operations (custom kernels)?

## References

- [Erdil & Schneider-Joseph 2024: Data movement limits to frontier model training](https://arxiv.org/abs/2411.01137)
- [Shavit 2023: What does it take to catch a Chinchilla?](https://arxiv.org/abs/2303.11341)
- [Baker et al.: Verifying International Agreements on AI](forthcoming)
