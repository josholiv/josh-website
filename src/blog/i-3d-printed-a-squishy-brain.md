---
title: 'I 3D printed a squishy brain!'
pubDate: 2025-11-23
description: "I've printed my brain before, but this time I made it squishy (with TPU)."
author: 'Josh Olivier'
image:
    url: '/images/blog/post-7/tpu-brain.jpg'
    alt: 'My brain 3D-printed with orange TPU'
tags: ["3Dprinting"]
readTime: '3'
---
## Previous prints

I've 3D printed my brain several times before (you can never have too many backups). In fact, 3D printing brains is what got me into 3D printing in the first place. Since I work in a neuroimaging lab, I've spent my fair share of time inside an MRI scanner while calibrating scanner settings for research studies. During one calibration session, I managed to get a T1 MRI scan of my brain, which I later used to 3D print it following the instructions in [this Github repo](https://github.com/miykael/3dprintyourbrain).

Here are two previous prints I've made of my brain:

<img src="/images/blog/post-7/previous-brains.jpg" alt="PLA brains I've printed previously" class="blog-body-pic">

The green brain on the right is a full-size print (representing the actual size of my brain), while the bluish-gray brain on the left is scaled down to 50% size. Both of these were printed using PLA, which is a rigid plastic that's the most commonly used material for 3D printing. It's the most common material for good reason: it's very reliable and hassle-free compared to other options. 

PLA brain prints are cool enough, but since I recently modified my printer with a direct drive extruder to be able to handle TPU (a flexible material), I decided to try printing a "squishy" brain.

## Setup and printing

I've actually been putting this off for a while, because I was expecting the print to not work out on the first try (I've had trouble with TPU prints before). However, I was pleasantly surprised this time. I scaled my brain model down to 50% its original size, which is the same size as the [bluish-gray brain pictured above](#previous-prints). I used the [print settings listed below](#print-settings), including a print speed of 40 mm/s, which is the maximum recommended print speed for the TPU filament I used. The advice I've heard is to print TPU as slowly as possible, but I decided to take a gamble here out of impatience, as printing at the lowest recommended speed, 20 mm/s, would add nearly 8 hours of print time.

<img src="/images/blog/post-7/tpu-brain-midprint.jpg" alt="My TPU brain mid-print" class="blog-body-pic">

## It's beautiful and squishy

Luckily, I din't need to learn any valuable life lessons about patience, because the brain printed beautifully on the first try. It took a total of 26 hours and 2 minutes, and used 103 g (34.95 m) of filament. 

<img src="/images/blog/post-7/tpu-brain-in-hand.jpg" alt="Holding the finished TPU brain" class="blog-body-pic">

## Cerebellum 

For the first few brains I 3D printed, I admittedly fell for the trap that over 60% of neuroimaging studies that claim to investigate the "whole brain" fall for: I only printed the cerebrum (the largest part of the brain), and ignored the cerebellum. Not this time! My new squishy brain also has a squishy cerebellum attached. 

Check out [this opinion paper](https://doi.org/10.1016/j.tics.2025.01.004) in Trends in Cognitive Sciences, titled "Ignoring the cerebellum is hindering progress in neuroscience," to read about how the cerebellum is being neglected in current neuroscience research and how new studies can address this issue.

<img src="/images/blog/post-7/tpu-brain-flipped.jpg" alt="Underside of the brain" class="blog-body-pic">


## Print Settings
### Printer and filament
- Printer: Creality Ender-3 V2 Neo
- Filament: Polymaker PolyFlex TPU95 (orange)
### Quality
- Layer Height: 0.2 mm
### Walls
- Wall Thickness: 0.8 mm
- Wall Line Count: 2
### Infill
- Infill Density: 10%
- Infill Pattern: Gyroid
### Material
- Printing Temperature: 220°C
- Build Plate Temperature: 45°C
### Speed
- Print Speed: 40.0 mm/s
### Cooling
- Enable Print Cooling: Yes
- Fan Speed: 100%
### Support
- Generate Support: Yes
- Support Structure: Tree
- Support Placement: Everywhere
- Support Overhang Angle: 45°
### Build Plate Adhesion
- Build Plate Adhesion Type: Skirt


<img src="/images/blog/post-7/tpu-brain-full-printer.jpg" alt="Full printer view during the print" class="blog-body-pic">