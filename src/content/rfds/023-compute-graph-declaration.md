---
title: "Compute Graph Declaration Protocol"
number: "023"
author: "FlexHEG"
state: "idea"
tags: ["verification", "logging"]
created: "2024-11-27"
---

## The Idea

To verify that declared workloads match actual workloads, developers make claims about the operations their code performs, which the Guarantee Processor verifies. These claims form a "compute graph"—a DAG of atomic operations (matrix multiplications, data transfers) on memory blocks.

Two modes:
1. **Static declaration**: Complete workload description upfront, verify execution matches
2. **Dynamic declaration**: Declare each operation as it executes, build graph incrementally

Dynamic declaration handles data-dependent control flow (like Mixture-of-Experts routing) that can't be described statically.

## Why It Matters

The gap between "what code was loaded" (attestation) and "what computation actually happened" is where violations hide. A verified compute graph closes this gap: you know not just that TensorFlow was running, but that it executed specific operations on specific data, producing specific outputs.

## Atomic Operations

Accelerator workloads are composed of a limited set of operations:

| Category | Examples |
|----------|----------|
| **Tensor math** | MatMul, Conv, Attention, Softmax |
| **Element-wise** | Add, ReLU, GELU, LayerNorm |
| **Data movement** | Copy, Transpose, Gather, Scatter |
| **Reduction** | Sum, Mean, Max |
| **Communication** | AllReduce, AllGather, Send, Recv |

Each operation: `(input_blocks, operation_type, parameters) → output_blocks`

## Verification Methods

| Data Source | Verification Approach |
|-------------|----------------------|
| Network I/O | Direct observation by Interlock |
| Local computation | Random recomputation of output samples via DMA |
| Memory state | Periodic snapshots, hash and store |
| Kernel execution | Parse kernel code (if accelerator trusted to execute as written) |

## Scaling Challenge

Per-accelerator logging is ~10KB/s (10 kernels/sec × 1KB/kernel). But for a 100K accelerator cluster, the global compute graph grows at 1GB/s—exceeds SSD write speeds and fills RAM instantly.

**Solution**: Distributed analysis. Each Guarantee Processor stores local graph + compact summaries of causally connected graphs. Global checks happen periodically (e.g., at checkpointing) rather than continuously.

## Static vs Dynamic

| Mode | Pros | Cons |
|------|------|------|
| **Static** | Full workload analysis before execution, no runtime overhead | Can't handle data-dependent control flow (MoE, early exit) |
| **Dynamic** | Handles any control flow, logs what actually happened | Higher runtime overhead, more complex verification |

## Existing Frameworks

Could build on:
- PyTorch FX / Dynamo (computation graphs)
- JAX (functional transformations)
- StableHLO (portable ML operations)
- ONNX (interchange format)
- CUDA Graphs (GPU execution graphs)

## Open Questions

- How to handle non-determinism (sampling, dropout, async execution)?
- What's the overhead of dynamic declaration?
- Can attackers construct "compliant-looking" graphs that hide violations?
- How to verify operations without trusting accelerator internals?
- Is Rice's Theorem a practical limitation for static analysis of guarantees?

## References

- [PyTorch FX](https://pytorch.org/docs/main/fx.html)
- [StableHLO](https://github.com/openxla/stablehlo)
- [DeepSeek DeepEP (MoE communication)](https://github.com/deepseek-ai/DeepEP)
- [Shavit 2023: Verifying Rules on Large-Scale Neural Network Training](https://arxiv.org/abs/2303.11341)
