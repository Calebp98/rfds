---
title: "Retrofittable Tamper Detection System"
number: "028"
author: "Amodo"
state: "idea"
tags: ["verification", "hardware", "physical-security"]
created: "2024-11-27"
---

## The Idea

A defense-in-depth tamper detection system that can be retrofitted to existing datacenter server trays. Unlike clean-sheet secure enclosure designs (RFD 020), this focuses on what can be installed in existing infrastructure with minimal downtime.

Amodo's v0.1 system includes 8 countermeasures selected from 38 candidates after reviewing 27 attack vectors.

## Implementation Status (Amodo)

**Sensor suite (all implemented):**
- Cameras (4 per tray, OpenCV-based intrusion detection)
- PIR motion sensors
- Temperature sensors
- Pressure sensors
- IMU (acceleration/orientation)
- Tamper mesh (custom KiCAD fork)
- Lid switch
- Time-of-flight sensors

**Control system:**
- Custom tamper control PCB
- STM32 with TrustZone (secure flash, secure SRAM, active tamper detection)
- Event pipeline: Camera → Pi → OpenCV → tamper controller
- Tamper response: tray power-down on event

**Tamper mesh:**
- Forked KiMesh for up-to-date KiCAD mesh generation
- Successfully demonstrated detection using STM built-in logic
- Planning to open-source updated KiMesh library

**Power-kill system:**
- Switching 1kW GPU load requires 80A relays (large footprint)
- Developed alternative PSU shutdown approach with smaller components
- Tradeoffs documented in whitepaper (WIP)

## Outputs Planned

- Open-source KiMesh library + lessons learned
- Wiki/whitepaper on each component
- Public demo for stakeholders
- Starting point for others doing tamper R&D

## Future Work

- Miniaturization
- Optimize for fast retrofit (install time)
- Red team / stress testing

## References

- Related: RFD 020 (Tamper-Evident Secure Enclosure) — design space
- STM32 TrustZone documentation
- KiMesh original project
